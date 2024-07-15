const createTokenPassword = async () => {
    try {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let otp = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters[randomIndex];
        }
        return otp;
    } catch (error) {
        throw error;
    }
};

module.exports = createTokenPassword;