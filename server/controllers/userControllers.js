const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Found Successfully",
            data: user
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the user"
        })   
    }
}

export default getCurrentUser;