import GlobalCache from "../Infrastructure/GlobalCache";
import QueryHelper from "../Types/Database/QueryHelper";
import ApiKeyPermissionService from "./ApiKeyPermissionService";
import BaseService from "./BaseService";
import TeamMemberService from "./TeamMemberService";
import TeamPermissionService from "./TeamPermissionService";
import LIMIT_MAX from "../../Types/Database/LimitMax";
import { JSONObject } from "../../Types/JSON";
import ObjectID from "../../Types/ObjectID";
import Permission, {
  UserGlobalAccessPermission,
  UserPermission,
  UserTenantAccessPermission,
} from "../../Types/Permission";
import APIKeyPermission from "Common/Models/DatabaseModels/ApiKeyPermission";
import Label from "Common/Models/DatabaseModels/Label";
import TeamMember from "Common/Models/DatabaseModels/TeamMember";
import TeamPermission from "Common/Models/DatabaseModels/TeamPermission";

enum PermissionNamespace {
  GlobalPermission = "global-permissions",
  ProjectPermission = "project-permissions",
}

export class AccessTokenService extends BaseService {
  public constructor() {
    super();
  }

  public async refreshUserAllPermissions(userId: ObjectID): Promise<void> {
    await this.refreshUserGlobalAccessPermission(userId);

    // query for all projects user belongs to.
    let teamMembers: Array<TeamMember> = await TeamMemberService.findBy({
      query: {
        userId: userId,
        hasAcceptedInvitation: true,
      },
      select: {
        projectId: true,
      },
      limit: LIMIT_MAX,
      skip: 0,
      props: {
        isRoot: true,
      },
    });

    if (!teamMembers) {
      teamMembers = [];
    }

    if (teamMembers.length === 0) {
      return;
    }

    const projectIds: Array<ObjectID> = teamMembers.map(
      (teamMember: TeamMember) => {
        return teamMember.projectId!;
      },
    );

    for (const projectId of projectIds) {
      await this.refreshUserTenantAccessPermission(userId, projectId);
    }
  }

  public async getDefaultApiGlobalPermission(
    projectId: ObjectID,
  ): Promise<UserGlobalAccessPermission> {
    return {
      projectIds: [projectId],
      globalPermissions: [
        Permission.Public,
        Permission.User,
        Permission.CurrentUser,
      ],
      _type: "UserGlobalAccessPermission",
    };
  }

  public async getMasterKeyApiGlobalPermission(
    projectId: ObjectID,
  ): Promise<UserGlobalAccessPermission> {
    return {
      projectIds: [projectId],
      globalPermissions: [
        Permission.Public,
        Permission.User,
        Permission.CurrentUser,
        Permission.ProjectOwner,
      ],
      _type: "UserGlobalAccessPermission",
    };
  }

  public async getMasterApiTenantAccessPermission(
    projectId: ObjectID,
  ): Promise<UserTenantAccessPermission> {
    const userPermissions: Array<UserPermission> = [];

    userPermissions.push({
      permission: Permission.ProjectOwner,
      labelIds: [],
      _type: "UserPermission",
    });

    const permission: UserTenantAccessPermission =
      this.getDefaultUserTenantAccessPermission(projectId);

    permission.permissions = permission.permissions.concat(userPermissions);

    return permission;
  }

  public async getApiTenantAccessPermission(
    projectId: ObjectID,
    apiKeyId: ObjectID,
  ): Promise<UserTenantAccessPermission> {
    // get team permissions.
    const apiKeyPermission: Array<APIKeyPermission> =
      await ApiKeyPermissionService.findBy({
        query: {
          apiKeyId: apiKeyId,
        },
        select: {
          permission: true,
          labels: {
            _id: true,
          },
          isBlockPermission: true,
        },

        limit: LIMIT_MAX,
        skip: 0,
        props: {
          isRoot: true,
        },
      });

    const userPermissions: Array<UserPermission> = [];

    for (const apiPermission of apiKeyPermission) {
      if (!apiPermission.labels) {
        apiPermission.labels = [];
      }

      userPermissions.push({
        permission: apiPermission.permission!,
        labelIds: apiPermission.labels.map((label: Label) => {
          return label.id!;
        }),
        isBlockPermission: apiPermission.isBlockPermission,
        _type: "UserPermission",
      });
    }

    const permission: UserTenantAccessPermission =
      this.getDefaultUserTenantAccessPermission(projectId);

    permission.permissions = permission.permissions.concat(userPermissions);

    return permission;
  }

  public async refreshUserGlobalAccessPermission(
    userId: ObjectID,
  ): Promise<UserGlobalAccessPermission> {
    // query for all projects user belongs to.
    let teamMembers: Array<TeamMember> = await TeamMemberService.findBy({
      query: {
        userId: userId,
        hasAcceptedInvitation: true,
      },
      select: {
        projectId: true,
      },
      limit: LIMIT_MAX,
      skip: 0,
      props: {
        isRoot: true,
      },
    });

    if (!teamMembers) {
      teamMembers = [];
    }

    const projectIds: Array<ObjectID> = teamMembers.map(
      (teamMember: TeamMember) => {
        return teamMember.projectId!;
      },
    );

    const permissionToStore: UserGlobalAccessPermission = {
      projectIds,
      globalPermissions: [
        Permission.Public,
        Permission.User,
        Permission.CurrentUser,
      ],
      _type: "UserGlobalAccessPermission",
    };

    await GlobalCache.setJSON("user", userId.toString(), permissionToStore);

    return permissionToStore;
  }

  public getDefaultUserTenantAccessPermission(
    projectId: ObjectID,
  ): UserTenantAccessPermission {
    const userPermissions: Array<UserPermission> = [];

    userPermissions.push({
      permission: Permission.CurrentUser,
      labelIds: [],
      isBlockPermission: false,
      _type: "UserPermission",
    });

    userPermissions.push({
      permission: Permission.UnAuthorizedSsoUser,
      labelIds: [],
      isBlockPermission: false,
      _type: "UserPermission",
    });

    const permission: UserTenantAccessPermission = {
      projectId,
      permissions: userPermissions,
      isBlockPermission: false,
      _type: "UserTenantAccessPermission",
    };

    return permission;
  }

  public async getUserGlobalAccessPermission(
    userId: ObjectID,
  ): Promise<UserGlobalAccessPermission | null> {
    const json: JSONObject | null = await GlobalCache.getJSONObject(
      "user",
      userId.toString(),
    );

    if (!json) {
      return await this.refreshUserGlobalAccessPermission(userId);
    }

    const accessPermission: UserGlobalAccessPermission =
      json as UserGlobalAccessPermission;

    accessPermission._type = "UserGlobalAccessPermission";

    return accessPermission;
  }

  public async refreshUserTenantAccessPermission(
    userId: ObjectID,
    projectId: ObjectID,
  ): Promise<UserTenantAccessPermission | null> {
    // query for all projects user belongs to.
    const teamMembers: Array<TeamMember> = await TeamMemberService.findBy({
      query: {
        userId: userId,
        projectId: projectId,
        hasAcceptedInvitation: true,
      },
      select: {
        teamId: true,
      },
      limit: LIMIT_MAX,
      skip: 0,
      props: {
        isRoot: true,
      },
    });

    const teamIds: Array<ObjectID> = teamMembers.map(
      (teamMember: TeamMember) => {
        return teamMember.teamId!;
      },
    );

    if (teamIds.length === 0) {
      return null;
    }

    // get team permissions.
    const teamPermissions: Array<TeamPermission> =
      await TeamPermissionService.findBy({
        query: {
          teamId: QueryHelper.any(teamIds),
        },
        select: {
          permission: true,
          labels: {
            _id: true,
          },
          isBlockPermission: true,
        },
        limit: LIMIT_MAX,
        skip: 0,
        props: {
          isRoot: true,
        },
      });

    const userPermissions: Array<UserPermission> = [];

    for (const teamPermission of teamPermissions) {
      if (!teamPermission.labels) {
        teamPermission.labels = [];
      }

      userPermissions.push({
        permission: teamPermission.permission!,
        labelIds: teamPermission.labels.map((label: Label) => {
          return label.id!;
        }),
        isBlockPermission: teamPermission.isBlockPermission,
        _type: "UserPermission",
      });
    }

    const permission: UserTenantAccessPermission =
      this.getDefaultUserTenantAccessPermission(projectId);

    permission.permissions = permission.permissions.concat(userPermissions);

    await GlobalCache.setJSON(
      PermissionNamespace.ProjectPermission,
      userId.toString() + projectId.toString(),
      permission,
    );

    return permission;
  }

  public async getUserTenantAccessPermission(
    userId: ObjectID,
    projectId: ObjectID,
  ): Promise<UserTenantAccessPermission | null> {
    const json: UserTenantAccessPermission | null =
      (await GlobalCache.getJSONObject(
        PermissionNamespace.ProjectPermission,
        userId.toString() + projectId.toString(),
      )) as UserTenantAccessPermission;

    if (json) {
      json._type = "UserTenantAccessPermission";
    }

    if (!json) {
      return await this.refreshUserTenantAccessPermission(userId, projectId);
    }

    return json;
  }
}

export default new AccessTokenService();
