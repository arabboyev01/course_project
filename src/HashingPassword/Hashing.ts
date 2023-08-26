import bcrypt from 'bcrypt'

const HashingPassword = async function (password: string): Promise<any> {
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);

}

export { HashingPassword }