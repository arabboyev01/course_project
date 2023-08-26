import bcrypt from 'bcrypt'

const HashingPassword = async function (password: string): Promise<any> {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds)
}

export { HashingPassword }