import mongoose, {
    RequiredFields,
    UniqueFields,
    EncryptedFields,
    Schema,
} from '../Infrastructure/ORM';

const schema: Schema = new Schema(
    {
        fieldName: String,
        fieldType: { type: String, enum: ['text', 'number'] },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
        uniqueField: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);
export const requiredFields: RequiredFields = schema.requiredPaths();

export const uniqueFields: UniqueFields = [];
export const encryptedFields: EncryptedFields = [];

export const slugifyField: string = '';

export default mongoose.model('MonitorCustomField', schema);
