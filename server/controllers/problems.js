const ProblemsModel = require('../models/problems');

exports.getProblems = async (req, res) => {
    try {
        const limit = req.body.limit;

        const totalDocs = await ProblemsModel.countDocuments({});

        if(limit > totalDocs) {
            return res.status(500).json({
                success: false,
                message: 'The number of problem is huge.'
            })
        }

        // Generate 5 unique random indices
        const randomIndices = Array.from({ length: totalDocs }, (_, i) => i)
            .sort(() => Math.random() - Math.random())
            .slice(0, limit);

        // Retrieve documents by random indices
        const problems = await Promise.all(randomIndices.map(index =>
            ProblemsModel.findOne().skip(index)
        ));

        return res.json({
            success: true,
            problems: problems
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
