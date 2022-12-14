import { pool } from "../database.js";

export const getTasks = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * from tasks ORDER BY createdAt ASC"
    );

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * from tasks WHERE id = ? ORDER BY createdAt ASC",
      [req.params.id]
    );

    if (result.length !== 1)
      return res.status(404).json({ message: "Task not found" });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTasks = async (req, res) => {
  try {
    const { title, description } = req.body;

    const [result] = await pool.query(
      "INSERT INTO tasks(title, description) VALUES (?,?)",
      [title, description]
    );
    console.log(result);
    res.json({ id: result.insertId, title, description });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTasks = async (req, res) => {
  try {
    await pool.query("UPDATE tasks SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);
    const [result] = await pool.query(
      "SELECT * from tasks WHERE id = ? ORDER BY createdAt ASC",
      [req.params.id]
    );

    if (result.length !== 1)
      return res.status(404).json({ message: "Task not found" });

    res.json({ "Task updated": result[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE from tasks WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Task not found" });

    await pool.query("DELETE from tasks WHERE id = ?", [req.params.id]);

    console.log(result);
    res.status(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
