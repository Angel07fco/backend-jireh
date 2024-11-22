const Feedback = require("./model");

const sendFeedbackPostAgendamiento = async (data) => {
  try {
    const { userId, citaId, pregunta1, pregunta2, pregunta3 } = data;

    const newFeedbackPostAgendamiento = new Feedback({
      userId,
      citaId,
      pregunta1,
      pregunta2,
      pregunta3,
    });
    const createdFeedbackPostAgendamiento =
      await newFeedbackPostAgendamiento.save();
    return createdFeedbackPostAgendamiento;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendFeedbackPostAgendamiento };
