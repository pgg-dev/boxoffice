import axios from "axios";
import moment from "moment";
import firestore from "../Firestore";

const SET_HEADER_VISIBILITY = "SET_HEADER_VISIBILITY";

const SET_LOGIN = "SET_LOGIN";
const SET_LOGIN_SUCCESS = "SET_LOGIN_SUCCESS";
const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
const SET_LOGOUT = "SET_LOGOUT";

const GET_MOVIES = "GET_MOVIES";
const GET_MOVIES_SUCCESS = "GET_MOVIES_SUCCESS";
const GET_MOVIES_ERROR = "GET_MOVIES_ERROR";

const GET_MOVIE = "GET_MOVIE";
const GET_MOVIE_SUCCESS = "GET_MOVIE_SUCCESS";
const GET_MOVIE_ERROR = "GET_MOVIE_ERROR";

export const goToHome = () => (dispatch, getState, { history }) => {
  history.push("/");
};

export const setHeaderVisibility = visible => async dispatch => {
  console.log("modules/setHeaderVisibility");
  dispatch({ type: SET_HEADER_VISIBILITY, visible });
};

export const setLogin = (provider, id) => async dispatch => {
  console.log("modules/setLogin");
  dispatch({ type: SET_LOGIN });
  try {
    dispatch({ type: SET_LOGIN_SUCCESS, provider });
  } catch (e) {
    dispatch({ type: SET_LOGIN_ERROR });
  }
};

export const setLogout = () => async dispatch => {
  console.log("modules/setLogout");
  dispatch({ type: SET_LOGOUT });
};

///////////////////////////
// export const getMovies = date => async dispatch => {
//   console.log("modules/getMovies");
//   dispatch({ type: GET_MOVIES, date });
//   const start = Date.now();

//   axios
//     .get(
//       "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
//       {
//         params: {
//           key: "8512edd89b714bf2cf35fcb50adac48d",
//           targetDt: date
//         }
//       }
//     )
//     .then(async data => {
//       const firstData = data.data.boxOfficeResult.dailyBoxOfficeList;
//       console.log(firstData);

//       for (let i = 0; i < firstData.length; i++) {
//         await axios
//           .get(
//             "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
//             {
//               params: {
//                 ServiceKey: "JIB0YUBGVC07GLD5WFBD",
//                 collection: "kmdb_new",
//                 title: firstData[i].movieNm,
//                 releaseDts: firstData[i].openDt.replace(/-/gi, "")
//               }
//             }
//           )
//           .then(data => {
//             if (data.data.Data[0].Result[0]) {
//               const secoundInfo = data.data.Data[0].Result[0];
//               console.log(secoundInfo);
//               if (secoundInfo.posters.includes("|"))
//                 secoundInfo.posters = secoundInfo.posters.substring(
//                   0,
//                   secoundInfo.posters.indexOf("|")
//                 );
//               Object.assign(firstData[i], secoundInfo);
//             }
//           });
//       } //for 끝
//       console.log(Date.now() - start);
//       const payload = firstData;
//       dispatch({ type: GET_MOVIES_SUCCESS, payload, date });
//     })
//     .catch(e => {
//       dispatch({ type: GET_MOVIES_ERROR, error: e, date });
//     });
// };

//////////////////////////////

// export const getMovies = date => async dispatch => {
//   console.log("modules/getMovies");
//   dispatch({ type: GET_MOVIES, date });
//   const start = Date.now();
//   const {
//     data: {
//       boxOfficeResult: { dailyBoxOfficeList: rankingData }
//     }
//   } = await axios.get(
//     "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
//     {
//       params: {
//         key: "8512edd89b714bf2cf35fcb50adac48d",
//         targetDt: date
//       }
//     }
//   );

//   const getData = async () => {
//     console.log(rankingData);
//     for (let i = 0; i < rankingData.length; i++) {
//       await axios
//         .get(
//           "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
//           {
//             params: {
//               ServiceKey: "JIB0YUBGVC07GLD5WFBD",
//               collection: "kmdb_new",
//               title: rankingData[i].movieNm,
//               releaseDts: rankingData[i].openDt.replace(/-/gi, "")
//             }
//           }
//         )
//         .then(data => {
//           let items = data.data.Data[0];
//           if (items.hasOwnProperty("Result")) {
//             const secoundInfo = items.Result[0];
//             console.log(secoundInfo);
//             if (secoundInfo.posters.includes("|"))
//               secoundInfo.posters = secoundInfo.posters.substring(
//                 0,
//                 secoundInfo.posters.indexOf("|")
//               );

//             Object.assign(rankingData[i], secoundInfo);
//           } else {
//             return rankingData[i];
//           }
//         });
//     }
//   };

//   Promise.all([rankingData, getData()])
//     .then(() => {
//       console.log(Date.now() - start);
//       const payload = rankingData;
//       dispatch({ type: GET_MOVIES_SUCCESS, payload, date });
//     })
//     .catch(e => {
//       dispatch({ type: GET_MOVIES_ERROR, error: e, date });
//     });
// };

////////////////////////

// const response = date => {
//   console.log("///////////response///////////////");
//   axios
//     .get(
//       "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
//       {
//         params: {
//           key: "8512edd89b714bf2cf35fcb50adac48d",
//           targetDt: date
//         }
//       }
//     )
//     .then(async data => {
//       const rankingData = data.data.boxOfficeResult.dailyBoxOfficeList;
//       console.log(rankingData);
//       for (let i = 0; i < rankingData.length; i++) {
//         axios
//           .get(
//             "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
//             {
//               params: {
//                 ServiceKey: "JIB0YUBGVC07GLD5WFBD",
//                 collection: "kmdb_new",
//                 title: rankingData[i].movieNm,
//                 releaseDts: rankingData[i].openDt.replace(/-/gi, "")
//               }
//             }
//           )
//           .then(data => {
//             const items = data.data.Data[0];

//             if (items.hasOwnProperty("Result")) {
//               const detailData = data.data.Data[0].Result[0];
//               console.log(detailData);
//               if (detailData.posters.includes("|"))
//                 detailData.posters = detailData.posters.substring(
//                   0,
//                   detailData.posters.indexOf("|")
//                 );

//               let docRef = firestore
//                 .collection(date.toString())
//                 .doc(rankingData[i].rank);

//               docRef.set(
//                 {
//                   rank: parseInt(rankingData[i].rank),
//                   title: rankingData[i].movieNm,
//                   poster: detailData.posters,
//                   openDt: moment(rankingData[i].openDt).format(
//                     "YYYY년 M월 D일"
//                   ),
//                   grade: detailData.rating[0].ratingGrade,
//                   genre: detailData.genre,
//                   director: detailData.director[0].directorNm,
//                   actors: [
//                     detailData.actor[0].actorNm,
//                     detailData.actor[1].actorNm
//                   ],
//                   plot: detailData.plot
//                 },
//                 { merge: true }
//               );
//             }
//           })
//           .then(() => console.log("끝!!!!!!!"));
//       }
//     });
// };

const response = date => async dispatch => {
  console.log("///////////response///////////////");
  const totalData = [];

  const {
    data: {
      boxOfficeResult: { dailyBoxOfficeList: rankingData }
    }
  } = await axios.get(
    "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    {
      params: {
        key: "8512edd89b714bf2cf35fcb50adac48d",
        targetDt: date
      }
    }
  );

  const getData = async () => {
    console.log(rankingData);
    for (let i = 0; i < rankingData.length; i++) {
      await axios
        .get(
          "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
          {
            params: {
              ServiceKey: "JIB0YUBGVC07GLD5WFBD",
              collection: "kmdb_new",
              title: rankingData[i].movieNm,
              releaseDts: rankingData[i].openDt.replace(/-/gi, "")
            }
          }
        )
        .then(data => {
          let items = data.data.Data[0];
          if (items.hasOwnProperty("Result")) {
            const detailData = items.Result[0];

            console.log(detailData);
            if (detailData.posters.includes("|"))
              detailData.posters = detailData.posters.substring(
                0,
                detailData.posters.indexOf("|")
              );

            let docRef = firestore
              .collection("movies")
              .doc(date.toString())
              .collection("movieList")
              .doc(rankingData[i].rank);

            docRef.set(
              {
                rank: parseInt(rankingData[i].rank),
                title: rankingData[i].movieNm,
                poster: detailData.posters,
                openDt: moment(rankingData[i].openDt).format("YYYY년 M월 D일"),
                grade: detailData.rating[0].ratingGrade,
                genre: detailData.genre,
                runtime: detailData.runtime,
                director: detailData.director[0].directorNm,
                actors: [
                  detailData.actor[0].actorNm,
                  detailData.actor[1].actorNm
                ],
                plot: detailData.plot
              },
              { merge: true }
            );
          } else {
            return rankingData[i];
          }
        });
    }
  };

  Promise.all([rankingData, getData()]).then(() => {
    dispatch(getMovies(date));
  });
};

// const {
//   data: {
//     boxOfficeResult: { dailyBoxOfficeList: rankingData }
//   }
// } = await axios.get(
//   "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
//   {
//     params: {
//       key: "8512edd89b714bf2cf35fcb50adac48d",
//       targetDt: date
//     }
//   }
//   ).then(async() => {
//     console.log(rankingData);
//     for (let i = 0; i < rankingData.length; i++) {
//       await axios
//         .get(
//           "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
//           {
//             params: {
//               ServiceKey: "JIB0YUBGVC07GLD5WFBD",
//               collection: "kmdb_new",
//               title: rankingData[i].movieNm,
//               releaseDts: rankingData[i].openDt.replace(/-/gi, "")
//             }
//           }
//         )
//         .then(data => {
//           const items = data.data.Data[0];
//           if (items.hasOwnProperty("Result")) {
//             const detailData = items.Result[0];
//             console.log(detailData);
//             if (detailData.posters.includes("|"))
//               detailData.posters = detailData.posters.substring(
//                 0,
//                 detailData.posters.indexOf("|")
//               );

//             let docRef = firestore.collection(date.toString()).doc();

//             docRef.set(
//               {
//                 rank: parseInt(rankingData[i].rank),
//                 title: rankingData[i].movieNm,
//                 poster: detailData.posters,
//                 openDt: moment(rankingData[i].openDt).format("YYYY년 M월 D일"),
//                 grade: detailData.rating[0].ratingGrade,
//                 genre: detailData.genre,
//                 director: detailData.director[0].directorNm,
//                 actors: [
//                   detailData.actor[0].actorNm,
//                   detailData.actor[1].actorNm
//                 ],
//                 plot: detailData.plot
//               },
//               { merge: true }
//             );
//           } else {
//             return rankingData[i];
//           }
//         });
//     }

//   })

// Promise.all([rankingData, getData()])
//   .then(() => {
//     // console.log(Date.now() - start);
//     getMovies(date);
//   })
//   .catch(e => {
//     // dispatch({ type: GET_MOVIES_ERROR, error: e, date });
//   });

export const getMovies = date => async dispatch => {
  console.log("modules/getMovies");
  console.log(date);
  if (date === "") {
    date = moment().format("YYYYMMDD") - 1;
  }

  firestore
    .collection("movies")
    .doc(date.toString())
    .collection("movieList")
    .orderBy("rank", "asc")
    .get()
    .then(snapshot => {
      // console.log(snapshot);
      console.log("//////////////////////");

      if (snapshot.empty) {
        dispatch(response(date));
      } else {
        dispatch({ type: GET_MOVIES, date });
        const rows = [];

        snapshot.forEach(doc => {
          const childData = doc.data();
          rows.push(childData);
        });
        const payload = rows;
        dispatch({ type: GET_MOVIES_SUCCESS, payload, date });
      }
    });
};

////////////////////////

export const getMovie = rank => async dispatch => {
  console.log("modules/getMovie");
  dispatch({ type: GET_MOVIE });
  try {
    dispatch({ type: GET_MOVIE_SUCCESS, rank });
  } catch (e) {
    dispatch({ type: GET_MOVIE_ERROR, error: e });
  }
};

const initialState = {
  visible: true,
  login: {
    status: false,
    provider: null
  },
  movies: {
    loading: false,
    data: null,
    error: null,
    date: null
    // date: moment().format("YYYYMMDD") - 1
  },
  movie: {
    loading: false,
    data: null,
    error: null
  }
};

export default function movies(state = initialState, action) {
  console.log("modules/movies");
  switch (action.type) {
    case SET_HEADER_VISIBILITY:
      return {
        ...state,
        visible: action.visible
      };
    case SET_LOGIN:
      return {
        ...state,
        login: {
          status: false,
          provider: null
        }
      };
    case SET_LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          status: true,
          provider: action.provider
        }
      };
    case SET_LOGIN_ERROR:
      return {
        ...state,
        login: {
          status: false,
          provider: action.provider
        }
      };
    case SET_LOGOUT:
      return {
        ...state,
        login: {
          status: false,
          provider: action.provider
        }
      };

    case GET_MOVIES:
      return {
        ...state,
        visible: true,
        movies: {
          loading: true,
          data: null,
          error: null,
          date: action.date
        }
      };
    case GET_MOVIES_SUCCESS:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          data: action.payload,
          error: null,
          date: action.date
        }
      };
    case GET_MOVIES_ERROR:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          data: null,
          error: action.error,
          date: action.date
        }
      };
    case GET_MOVIE:
      return {
        ...state,
        movie: {
          loading: true,
          data: null,
          error: null
        }
      };
    case GET_MOVIE_SUCCESS:
      return {
        ...state,
        movie: {
          loading: false,
          data: state.movies.data.find(movie => movie.rank === action.rank),
          error: null
        }
      };
    case GET_MOVIE_ERROR:
      return {
        ...state,
        movie: {
          loading: false,
          data: null,
          error: action.error
        }
      };
    default:
      return state;
  }
}
