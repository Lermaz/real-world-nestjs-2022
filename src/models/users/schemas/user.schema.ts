import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';

export const validRolTypes = {
  values: ['Administrator', 'Accounting'],
  message: '{VALUE} is not an allowed type',
};

export const UserSchema = new mongoose.Schema(
  {
    _rol: {
      type: String,
      required: [true, 'You must choose a role'],
      enum: validRolTypes,
    },
    first_name: {
      type: String,
      minlength: 3,
      maxlength: 127,
      required: [true, 'The first name is empty'],
    },
    last_name: {
      type: String,
      minlength: 3,
      maxlength: 127,
      required: [true, 'The last name is empty'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
      maxlength: 255,
      minlength: 6,
      required: [true, 'The email is empty'],
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: [true, 'The password is empty'],
    },
  },
  {
    versionKey: false,
  },
);

UserSchema.index({ first_name: 1 });
UserSchema.index({ email: 1 });

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this['password'], 10);

    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
