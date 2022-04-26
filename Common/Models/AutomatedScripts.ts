import mongoose, {
    RequiredFields,
    UniqueFields,
    EncryptedFields,
    Schema,
} from '../Infrastructure/ORM';

const schema: Schema = new Schema(
    {
        name: String,
        script: String,
        scriptType: String,
        slug: String,
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            index: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
        deletedByUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        successEvent: [
            {
                automatedScript: {
                    type: Schema.Types.ObjectId,
                    ref: 'AutomationSript',
                    index: true,
                },
                callSchedule: {
                    type: Schema.Types.ObjectId,
                    ref: 'Schedule',
                    index: true,
                },
            },
        ],
        failureEvent: [
            {
                automatedScript: {
                    type: Schema.Types.ObjectId,
                    ref: 'AutomationSript',
                    index: true,
                },
                callSchedule: {
                    type: Schema.Types.ObjectId,
                    ref: 'Schedule',
                    index: true,
                },
            },
        ],
    },
    { timestamps: true }
);

export const requiredFields: RequiredFields = schema.requiredPaths();

export const uniqueFields: UniqueFields = [];
export const encryptedFields: EncryptedFields = [];

export const slugifyField: string = '';

export default mongoose.model('AutomationSript', schema);
