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

const GET_COMMENT_SUCCESS = "GET_COMMENT_SUCCESS";
const GET_COMMENT_ERROR = "GET_COMMENT_ERROR";

export const goToHome = () => (dispatch, getState, { history }) => {
  history.push("/");
};

export const setHeaderVisibility = visible => async dispatch => {
  console.log("modules/setHeaderVisibility");
  dispatch({ type: SET_HEADER_VISIBILITY, visible });
};

export const setLogin = (provider, id) => async dispatch => {
  console.log("modules/setLogin");
  try {
    firestore
      .collection("users")
      .where("id", "==", id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          let docRef = firestore.collection("users").doc();

          docRef.set(
            {
              provider: provider,
              id: id
            },
            { merge: true }
          );
        }
        // snapshot .forEach(doc  => {
        //   console.log(doc.id, "=>", doc .data());
        // });
      });
    dispatch({ type: SET_LOGIN_SUCCESS, id, provider });
  } catch (e) {
    dispatch({ type: SET_LOGIN_ERROR });
  }
};

export const setLogout = () => async dispatch => {
  console.log("modules/setLogout");
  dispatch({ type: SET_LOGOUT });
};

//////////////////////////////////////////////////////////setMovies

const setMovies = async rankingData => {
  console.log("///////////setMovies///////////////");
  return new Promise(async resolve => {
    await axios
      .get(
        "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json.jsp",
        {
          params: {
            ServiceKey: "JIB0YUBGVC07GLD5WFBD",
            collection: "kmdb_new",
            title: rankingData.movieNm,
            releaseDts: rankingData.openDt.replace(/-/gi, "")
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

          let docRef = firestore.collection("movies").doc(rankingData.movieCd);
          docRef.set(
            {
              id: rankingData.movieCd,
              title: rankingData.movieNm,
              poster: detailData.posters,
              openDt: moment(rankingData.openDt).format("YYYY년 M월 D일"),
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

          resolve(rankingData);
        } else {
          return rankingData;
        }
      });
  });
};

const getData = rankingData => {
  return new Promise(resolve =>
    firestore
      .collection("movies")
      .doc(rankingData.movieCd)
      .get()
      .then(async doc => {
        if (!doc.exists) {
          await setMovies(rankingData).then(data => resolve(getData(data)));
        } else {
          const childData = doc.data();
          resolve(childData);
        }
      })
  );
};

//////////////////////////////////////////////////////////getMovies
export const getMovies = date => async dispatch => {
  console.log("modules/getMovies");
  dispatch({ type: GET_MOVIES });

  if (date === "") {
    date = moment().format("YYYYMMDD") - 1;
  }

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

  let payload = [];
  for (let i = 0; i < rankingData.length; i++) {
    await getData(rankingData[i]).then(async data => {
      payload.push(data);
    });
  }
  dispatch({ type: GET_MOVIES_SUCCESS, payload, date });
};

export const getMovie = movieID => async dispatch => {
  console.log("modules/getMovie");
  console.log(movieID);
  dispatch({ type: GET_MOVIE });
  try {
    dispatch({ type: GET_MOVIE_SUCCESS, movieID });
  } catch (e) {
    dispatch({ type: GET_MOVIE_ERROR, error: e });
  }
};

export const getComment = movieID => async dispatch => {
  console.log("getComment");
  try {
    firestore
      .collection("movies")
      .doc(movieID)
      .get()
      .then(doc => {
        if (doc.data().comments !== undefined) {
          const payload = [];
          doc.data().comments.forEach(comment => {
            payload.push(comment);
          });
          dispatch({ type: GET_COMMENT_SUCCESS, payload });
        }
      });
  } catch (e) {
    dispatch({ type: GET_COMMENT_ERROR, error: e });
  }
};

export const addComment = (changComment, movieID) => async dispatch => {
  console.log("addComment");
  try {
    let docRef = firestore.collection("movies").doc(movieID);

    docRef.set(
      {
        comments: changComment
      },
      { merge: true }
    );

    dispatch(getComment(movieID));
  } catch (e) {
    dispatch({ type: GET_COMMENT_ERROR, error: e });
  }
};

const initialState = {
  visible: true,
  login: {
    status: false,
    id: null,
    provider: null
  },
  movies: {
    loading: false,
    data: null,
    error: null,
    date: null
  },
  movie: {
    loading: false,
    data: null,
    error: null
  },
  comment: []
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
          id: null,
          type: null
        }
      };
    case SET_LOGIN_SUCCESS:
      return {
        ...state,
        login: {
          status: true,
          id: action.id,
          provider: action.provider
        }
      };
    case SET_LOGIN_ERROR:
      return {
        ...state,
        login: {
          status: false,
          id: null
        }
      };
    case SET_LOGOUT:
      return {
        ...state,
        login: {
          status: false,
          id: null
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
          data: state.movies.data.find(movie => movie.id === action.movieID),
          error: null
        },
        comment: []
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
    case GET_COMMENT_SUCCESS:
      return {
        ...state,
        comment: action.payload
      };
    case GET_COMMENT_ERROR:
      return {
        ...state,
        comment: []
      };
    default:
      return state;
  }
}
