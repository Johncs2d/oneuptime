import mongoose, {
    RequiredFields,
    UniqueFields,
    EncryptedFields,
    Schema,
} from '../Infrastructure/ORM';

/**
 * Represents the Zapier Schema in the database.
 * @let {object} zapierSchema
 * @property {string} project - The `ID` of the project the incident is created on.
 * @property {string} url - The zapier hook that the oneuptime server pings with new incidents.
 * @property {string} type - The name of trigger that receives the incident object.
 * @property {number} counter - The number of incidents send to the zapier `url`.
 *
 */
const schema: Schema = new Schema({
    project: String,
    url: URL,
    type: String,
    monitors: [String],
    deleted: {
        type: Boolean,
        default: false,
    },
});
export const requiredFields: RequiredFields = schema.requiredPaths();

export const uniqueFields: UniqueFields = [];
export const encryptedFields: EncryptedFields = [];

export const slugifyField: string = '';

export default mongoose.model('Zapier', schema);
