const connection = require("../db/connectionDb");

//index

function index(req, res) {
  const sql = `SELECT doctors.* , specialties.specialty_name
FROM doctors
INNER JOIN specialties
ON specialties.id = doctors.specialty_id
ORDER BY doctors.id;
  `;
  connection.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Database query failed",
      });

    const resultsDoctor = results.map((doctor) => ({
      ...doctor,
      image: generatePathIgm(doctor.image),
    }));
    console.log(resultsDoctor);

    res.json({
      status: "ok",
      resultsDoctor,
    });
    console.log(res);
  });
}

//index reviews
function indexReviews(req, res) {
  const sql = "SELECT * FROM reviews";
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

//index reviews
function indexProvinces(req, res) {
  const sql = "SELECT * FROM province";
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

//index specialties
function indexSpecialties(req, res) {
  const sql = "SELECT * FROM specialties";
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

// ! search

function indexSearch(req, res) {
  const { doctorId, specialtyId, provinceId } = req.query;

  let sqlSearch = `SELECT doctors.*, 
  province.province_name,
  specialties.specialty_name
  FROM doctors 
  JOIN province ON doctors.province_id = province.id 
  JOIN specialties ON doctors.specialty_id = specialties.id 
  WHERE 1=1`;

  if (doctorId) {
    sqlSearch += ` AND doctors.id = ${doctorId}`;
  }

  if (specialtyId) {
    sqlSearch += ` AND specialty_id = ${specialtyId}`;
  }

  if (provinceId) {
    sqlSearch += ` AND province_id = ${provinceId}`;
  }

  if (!doctorId && !specialtyId && !provinceId) {
    sqlSearch += ` LIMIT 5`;
  }

  connection.query(sqlSearch, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    const resultsDoctor = results.map((doctor) => ({
      ...doctor,
      image: generatePathIgm(doctor.image),
    }));

    res.json({
      status: "ok",
      resultsDoctor,
    });
  });
}

//show
function show(req, res) {
  const id = parseInt(req.params.id);
  const sqlDoctors =
    "SELECT doctors.*, province.province_name FROM `doctors` INNER JOIN `province` ON doctors.province_id = province.id WHERE doctors.`id` = ?";
  connection.query(sqlDoctors, [id], (err, doctorsResults) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
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
            image: generatePathIgm(doctor.image),
            reviews,
            specialty: specialtyResults,
          },
        });
      });
    });
  });
}

//Show filtered doctors
function showFilteredDoctors(req, res) {
  const id = parseInt(req.params.id);
  const sqlFilteredDoctor = `SELECT doctors.*
  FROM doctors
  INNER JOIN specialties
  ON  doctors.specialty_id = specialties.id
  WHERE specialties.id = ? `;
  connection.query(sqlFilteredDoctor, [id], (err, specialtyResutl) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: "Database query failed",
      });
    }
    if (specialtyResutl.lenght === 0) {
      return res.status(404).json({ error: "doctor not found" });
    }

    const resultsFileredDoctor = specialtyResutl.map((doctor) => ({
      ...doctor,
      image: generatePathIgm(doctor.image),
    }));
    res.json({
      status: "ok",
      specialty: resultsFileredDoctor,
    });
  });
}

function showFilteredDoctorsProvince(req, res) {
  const specialtyId = parseInt(req.params.specialtyId);
  const provinceId = parseInt(req.params.provinceId);

  // Costruisci la query SQL per ottenere i medici filtrati per specialità e provincia
  const sqlFilteredDoctor = `
    SELECT doctors.id, doctors.name, doctors.surname, doctors.city, doctors.image
    FROM doctors
    INNER JOIN specialties ON doctors.specialty_id = specialties.id
    INNER JOIN province ON doctors.province_id = province.id
    WHERE specialties.id = ?
    AND province.id = ?
  `;

  connection.query(
    sqlFilteredDoctor,
    [specialtyId, provinceId],
    (err, provincesResult) => {
      if (err) {
        console.log("Database query error:", err);
        return res.status(500).json({
          error: "Database query failed",
        });
      }

      if (provincesResult.length === 0) {
        return res.status(404).json({ error: "No doctors found" });
      }

      // Mappa i risultati ottenuti dal database in un formato che il frontend si aspetta
      const resultsFilteredDoctor = provincesResult.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        surname: doctor.surname,
        city: doctor.city,
        image: generatePathIgm(doctor.image),
      }));

      // Risposta JSON con lo status e i dati dei medici
      res.json({
        status: "ok",
        doctors: resultsFilteredDoctor,
      });
    }
  );
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
  });
}

function storeReview(req, res) {
  const { doctor_id, username, email, rating, review_text } = req.body;

  console.log("Dati ricevuti:", req.body);

  if (!doctor_id || !username || !email || !rating || !review_text) {
    return res.status(400).json({
      status: "ko",
      message:
        "Manca uno dei campi obbligatori: doctor_id, rating, review_text, username o email",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      status: "ko",
      message: "Il punteggio deve essere un valore compreso tra 1 e 5",
    });
  }

  console.log("Valore rating:", rating);

  if (review_text.length < 10) {
    return res.status(400).json({
      status: "ko",
      message: "Il testo della recensione deve contenere almeno 10 caratteri",
    });
  }

  console.log("Testo della recensione:", review_text);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "ko",
      message: "L'indirizzo email non è valido",
    });
  }

  console.log("Email ricevuta:", email);

  const sql = `
    INSERT INTO reviews (doctor_id, username, email, rating, review_text)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [doctor_id, username, email, rating, review_text],
    (err, results) => {
      if (err) {
        console.error("Errore nella query:", err);
        return res.status(500).json({
          status: "ko",
          message: "Errore nella query",
        });
      }

      res.status(201).json({
        status: "ok",
        message: "Recensione registrata con successo!",
      });
    }
  );
}

const generatePathIgm = (imgName) => {
  const { APP_HOST, APP_PORT } = process.env;
  return `${APP_HOST}:${APP_PORT}/img/${imgName}`;
};
// console.log(generatePathIgm);

module.exports = {
  index,
  indexSpecialties,
  indexReviews,
  show,
  showFilteredDoctors,
  showFilteredDoctorsProvince,
  storeDoctor,
  storeReview,
  indexProvinces,
  indexSearch,
};
