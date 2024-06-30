const startExercise = async (req, res) => {
  try {
    const { exercise_id } = req.params;
    const { user_id, workout_position_id } = req.body;

    const checkQuery = `
        SELECT * FROM user_workouts
        WHERE user_id = $1 AND workout_id = $2 AND workout_position_id = $3;
      `;
    const checkResult = await client.query(checkQuery, [
      user_id,
      exercise_id,
      workout_position_id,
    ]);
    const existingEntry = checkResult.rows[0];

    if (existingEntry) {
      const updateQuery = `
          UPDATE user_workouts
          SET workout_count = workout_count + 1, workout_date = NOW()
          WHERE user_workout_id = $1;
        `;
      await client.query(updateQuery, [existingEntry.user_workout_id]);
      res.status(200).json({ message: "Workout count updated successfully." });
    } else {
      const insertQuery = `
          INSERT INTO user_workouts (user_id, workout_id, workout_count, workout_date, workout_position_id)
          VALUES ($1, $2, 1, NOW(), $3);
        `;
      await client.query(insertQuery, [
        user_id,
        exercise_id,
        workout_position_id,
      ]);
      res
        .status(201)
        .json({ message: "New workout entry added successfully." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};



const addWorkout = async (req, res) => {
  try {
  } catch (err) {}
};

export { startExercise, addWorkout };
