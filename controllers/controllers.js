const connection = require("../db/connectionDb");

//index
function index(req, res) {
  const sql = "SELECT * FROM doctors";
  connection.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Database query failed",
      });

    res.json({
      status: "ok",
      results,
    });
    console.log(res);
  });
}

//show
function show(req, res) {
  const id = parseInt(req.params.id);
  const sqlDoctors = "SELECT * FROM `doctors` WHERE `id` = ? ";
  connection.query(sqlDoctors, [id], (err, doctorsResults) => {
    if (err) {
      console.log(err);
      return res.tatus(500).json({
        error: "Database query failed",
      });
    }
    if (doctorsResults.lenght === 0) {
      return res.status(404).json({ error: "doctor not found" });
    }
    const doctor = doctorsResults[0];

    const sqlReviews = `
function show(req, res) {
  const id = parseInt(req.params.id);
  const sqlDoctors = "SELECT * FROM `doctors` WHERE `id` = ? ";
  connection.query(sqlDoctors, [id], (err, doctorsResults) => {
    if (err) {
      console.log(err);
      return res.tatus(500).json({
        error: "Database query failed",
      });
    }
    if (doctorsResults.lenght === 0) {
      return res.status(404).json({ error: "doctor not found" });
    }
    const doctor = doctorsResults[0];

    const sqlReviews = `
            SELECT reviews.*
            FROM reviews
            INNER JOIN doctors
            ON doctors.id = reviews.doctor_id
            WHERE doctors.id = ?`;
    connection.query(sqlReviews, [id], (err, reviewResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Database query failed",
        });
      }
      const reviews = reviewResults;
    connection.query(sqlReviews, [id], (err, reviewResults) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Database query failed",
        });
      }
      const reviews = reviewResults;

      const sqlSpecialty = `
      const sqlSpecialty = `
            SELECT specialties.*
            FROM specialties
            INNER JOIN doctors
            ON doctors.specialty_id = specialties.id
            WHERE doctors.id = ?`;
      connection.query(sqlSpecialty, [id], (err, specialtyResults) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Database query failed",
          });
        }
        res.json({
          status: "ok",
          doctor: {
            ...doctor,
            reviews,
            specialty: specialtyResults,
          },
        });
      });
    });
  });
}

//create
function storeDoctor(req, res) {
  const {
    name,
    surname,
    specialty_id,
    email,
    phone_number,
    address,
    description,
    city,
    province,
  } = req.body;

  if (
    !email ||
    !name ||
    !surname ||
    !phone_number ||
    !address ||
    !specialty_id
  ) {
    return res.status(400).json({
      status: "ko",
      message:
        "Manca uno dei campi obbligatori: Email, Name, Surname, Phone, Address, or Specialization",
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      status: "ko",
      message: "Il nome deve contenere almeno 3 lettere",
    });
  }

  if (surname.length < 3) {
    return res.status(400).json({
      status: "ko",
      message: "Il cognome deve contenere almeno 3 lettere",
    });
  }

  if (address.length < 5) {
    return res.status(400).json({
      status: "ko",
      message: "L'indirizzo deve contenere almeno 5 caratteri",
    });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "ko",
      message: "La mail inserita non è valida",
    });
  }

  const phoneRegex = /^\+?[0-9]+$/;
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({
      status: "ko",
      message:
        "Il numero di telefono non è valido. Deve contenere solo numeri e, se presente, il simbolo '+' deve essere all'inizio.",
    });
  }

  const checkEmailSql = "SELECT * FROM doctors WHERE email = ?";
  connection.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: "ko",
        message: "Database query failed",
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        status: "ko",
        message: "L'email è già presente nel sistema",
      });
    }

    const sql = `
      INSERT INTO doctors (name, surname, specialty_id, email, phone_number, address, description, city, province)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [
        name,
        surname,
        specialty_id,
        email,
        phone_number,
        address,
        description || null,
        city || null,
        province || null,
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: "ko",
            message: "Database query failed",
          });
        }

      res.json({
        status: "ok",
        message: "Dottore registrato!",
      });
    }
  );
}

module.exports = { index, show, storeDoctor };
