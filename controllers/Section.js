const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // Extracting data from the request body
    const { sectionName, courseId } = req.body;

    // Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required.",
      });
    }

    // Create a new section
    const newSection = await Section.create({ sectionName });

    // Update the course with the new section
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    );

    // If course is not found, handle it appropriately
    if (!updatedCourseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section created successfully.",
      data: updatedCourseDetails,
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create section.",
      error: error.message,
    });
  }
};
