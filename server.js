'use strict';

const express = require("express");
const myData = require("./movieData/Data.json")
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const pg = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;


app.get('/', dataHandler);
app.get('/favorite', favoritePage);
app.get('/trending', trendingPage);
app.get('/nowplaying', movieNow_playing);
app.get('/toprated', movieTop_rated);
app.get('/search', searchPage);
// app.post('/addFavorat', addFavorat);
// app.get("/getFavorat", getFavorat);
// app.put("/updateFavmovie/:id", updateFavmovie);
// app.delete("/deleteFavmovie/:id", deleteFavmovie);
// app.get('/getMovie/:id', getMovieById);
app.use("*", notFoundHandler);
app.use(errorHandler);

function show(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

};

function dataHandler(req, res) {
    let result = [];
    myData.data.forEach((value) => {
        let myShow = new show(value.title, value.poster_path, value.overview);
        result.push(myShow);
    });
    return res.status(200).json(result);
};

function favoritePage(request, response) {
    return response.status(200).send('Welcome to Favorite Page')
}

function trendingPage(req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
        .then(value => {
            value.data.results.map(value => {
                let mymovis = new show(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
                result.push(mymovis)
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);

        });
};
function searchPage(req, res) {
    let searchquery = req.query.search;
    let result = [];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchquery}`)
        .then(value => {
            value.data.results.map(value => {
                let movie = new show(value.id, value.title, value.release_date, value.poster_path, value.overview);
                result.push(movie);

            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);

        });
}

function movieNow_playing(req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}&language=en-US&page=1`)
        .then(value => {
            value.data.results.map(value => {
                let mymovis = new show(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
                result.push(mymovis)
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);

        });

}

function movieTop_rated(req, res) {
    let result = [];
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
        .then(value => {
            value.data.results.map(value => {
                let mymovis = new show(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A");
                result.push(mymovis)
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);

        });

}
// function addFavorat(req, res) {
//     let movie = req.body;
//     const sql = `INSERT INTO postgres( title,release_date, poster_path, overview,comment) VALUES($1, $2, $3, $4,$5)RETURNING * ;`
//     let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];

//     client.query(sql, values).then((data) => {

//         return res.status(201).json(data.rows);
//     }).catch(error => {
//         errorHandler(error, req, res);
//     })
// };
// function getFavorat(req, res) {

//     const sql = `SELECT * FROM postgres`;

//     client.query(sql).then(data => {
//         return res.status(200).json(data.rows);
//     }).catch(error => {
//         errorHandler(error, req, res);
//     })
// }
// function updateFavmovie(req, res) {
//     const id = req.params.id;
//     const movie = req.body;
//     const sql = `UPDATE postgres SET comment=$1 WHERE id=${id} RETURNING *;`
//     const values = [movie.comment];
//     client.query(sql, values).then(data => {
//         return res.status(200).json(data.rows);
//     }).catch(error => {
//         errorHandler(error, req, res);
//     })
// };
// function deleteFavmovie(req, res) {
//     const id = req.params.id;
//     const sql = `DELETE FROM postgres WHERE id=${id};`

//     client.query(sql).then(() => {
//         return res.status(204).json([]);
//     }).catch(error => {
//         errorHandler(error, req, res);
//     })
// }
// function getMovieById(req, res) {
//     const id = req.params.id;

//     const sql = `SELECT * FROM postgres  WHERE id=$1 ;`;
//     const value = [id];

//     client.query(sql, value)
//         .then((result) => {
//             return res.status(200).json(result.rows);
//         }).catch((error) => {
//             errorHandler(error, req, res);
//         })

// }



function notFoundHandler(req, res) {

    return res.status(404).send("Sorry, something went wrong");
}
function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    return res.status(500).send(err);
}
client.connect()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("Listen on 3000");
        });
    });
