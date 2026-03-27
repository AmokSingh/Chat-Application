import jwt from 'jsonwebtoken';
const gentoken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2d" });
        return token;
    }
    catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Failed to generate token");  
    }
}

export default gentoken;