import axios from "axios";
import moment from "moment";
import firestore from "../Firestore";

const SET_HEADER_VISIBILITY = "SET_HEADER_VISIBILITY";

// const SET_LOGIN_REQUEST = "SET_LOGIN_REQUEST";
// const SET_LOGIN_SUCCESS = "SET_LOGIN_SUCCESS";
// const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
const SET_LOGOUT = "SET_LOGOUT";

const GET_USER_REQUEST = "GET_USER_REQUEST";
const GET_USER_SUCCESS = "GET_USER_SUCCESS";
const GET_USER_ERROR = "GET_USER_ERROR";

const GET_MOVIES_REQUEST = "GET_MOVIES_REQUEST";
const GET_MOVIES_SUCCESS = "GET_MOVIES_SUCCESS";
const GET_MOVIES_ERROR = "GET_MOVIES_ERROR";

const GET_MOVIE_REQUEST = "GET_MOVIE_REQUEST";
const GET_MOVIE_SUCCESS = "GET_MOVIE_SUCCESS";
const GET_MOVIE_ERROR = "GET_MOVIE_ERROR";

const GET_COMMENT_REQUEST = "GET_COMMENT_REQUEST";
const GET_COMMENT_SUCCESS = "GET_COMMENT_SUCCESS";
const GET_COMMENT_ERROR = "GET_COMMENT_ERROR";

export const goToPath = path => (dispatch, getState, { history }) => {
  history.push(path);
};

export const setHeaderVisibility = visible => dispatch => {
  console.log("modules/setHeaderVisibility");
  dispatch({ type: SET_HEADER_VISIBILITY, visible });
};

export const setLogin = (provider, id, name) => dispatch => {
  console.log("modules/setLogin");
  try {
    firestore
      .collection("users")
      .where("id", "==", id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          let docRef = firestore.collection("users").doc();

          docRef
            .set(
              {
                provider: provider,
                id: id,
                name: name,
                reg_date: moment().format("YYYYMMDD"),
                wishList: [],
                commentList: []
              },
              { merge: true }
            )
            .then(dispatch(getUser(id)));
        } else {
          dispatch(getUser(id));
        }
      });
  } catch (e) {
    dispatch({ type: GET_USER_ERROR, error: e });
  }
};

export const updateUser = (item, id, data) => dispatch => {
  console.log("updateUser");
  try {
    firestore
      .collection("users")
      .where("id", "==", id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const docId = firestore.collection("users").doc(doc.id);
          if (item === "delete") {
            docId.delete();
          } else {
            docId
              .update({
                [item]: data
              })
              .then(dispatch(getUser(id)));
          }
        });
      });
  } catch (e) {
    dispatch({ type: GET_USER_ERROR, error: e });
  }
};

export const getUser = id => dispatch => {
  console.log("getUser");
  dispatch({ type: GET_USER_REQUEST });
  try {
    firestore
      .collection("users")
      .where("id", "==", id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const {
            id,
            name,
            provider,
            reg_date,
            wishList,
            commentList
          } = doc.data();
          dispatch({
            type: GET_USER_SUCCESS,
            id,
            name,
            provider,
            reg_date,
            wishList,
            commentList
          });
        });
      });
  } catch (e) {
    dispatch({
      type: GET_USER_ERROR,
      error: e
    });
  }
};

export const setLogout = () => dispatch => {
  dispatch({ type: SET_LOGOUT });
  window.sessionStorage.clear();
  dispatch(goToPath("/"));
};

export const getMovies = (period, date) => (dispatch, getState) => {
  console.log("getMovies");
  dispatch({ type: GET_MOVIES_REQUEST });

  let { movieList } = getState().movies.movies;
  const key = "8512edd89b714bf2cf35fcb50adac48d";
  let rankingData = [];
  let showRange;

  const setMovies = rankingData => {
    return new Promise(resolve => {
      axios
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

            if (detailData.rating[0].ratingGrade.includes("|"))
              detailData.rating[0].ratingGrade = detailData.rating[0].ratingGrade.substring(
                0,
                detailData.rating[0].ratingGrade.indexOf("|")
              );

            let docRef = firestore
              .collection("movies")
              .doc(rankingData.movieCd);
            docRef.set(
              {
                id: rankingData.movieCd,
                title: rankingData.movieNm,
                titleEng: detailData.titleEng,
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
                plot: detailData.plot,
                comments: []
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

  const getMovieData = rankingData => {
    return new Promise(resolve => {
      firestore
        .collection("movies")
        .doc(rankingData.movieCd)
        .get()
        .then(doc => {
          if (!doc.exists) {
            setMovies(rankingData).then(data => resolve(getMovieData(data)));
          } else {
            resolve(doc.data());
          }
        });
    });
  };

  const getMovieList = () => {
    for (let i = 0; i < rankingData.length; i++) {
      movieList.push(getMovieData(rankingData[i]));
    }
    Promise.all(movieList).then(movieList => {
      dispatch({
        type: GET_MOVIES_SUCCESS,
        date,
        showRange,
        movieList,
        period
      });
    });
  };

  try {
    axios
      .get(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/search${
          period === "daily" ? "Daily" : "Weekly"
        }BoxOfficeList.json`,
        {
          params: {
            key,
            targetDt: date,
            weekGb: 0
          }
        }
      )
      .then(val => {
        const data = val.data.boxOfficeResult;
        period === "daily"
          ? (rankingData = data.dailyBoxOfficeList)
          : (rankingData = data.weeklyBoxOfficeList);
        showRange = data.showRange.split("~");
        getMovieList();
      });
  } catch (e) {
    dispatch({ type: GET_MOVIES_ERROR, error: e });
  }
};

export const getMovie = movieId => dispatch => {
  console.log("modules/getMovie");
  dispatch({ type: GET_MOVIE_REQUEST });
  try {
    firestore
      .collection("movies")
      .doc(movieId)
      .get()
      .then(doc => {
        const payload = doc.data();
        dispatch({ type: GET_MOVIE_SUCCESS, payload });
      });
  } catch (e) {
    dispatch({ type: GET_MOVIE_ERROR, error: e });
  }
};

export const getComment = movieId => dispatch => {
  console.log("getComment");
  dispatch({ type: GET_COMMENT_REQUEST });
  try {
    firestore
      .collection("movies")
      .doc(movieId)
      .get()
      .then(doc => {
        const payload = [];
        if (doc.data().comments !== undefined) {
          doc.data().comments.forEach(comment => {
            payload.push(comment);
          });
          dispatch({ type: GET_COMMENT_SUCCESS, payload });
        } else {
          dispatch({ type: GET_COMMENT_SUCCESS, payload });
        }
      });
  } catch (e) {
    dispatch({ type: GET_COMMENT_ERROR, error: e });
  }
};

export const updateComment = (changComment, movieId) => dispatch => {
  console.log("updateComment");
  try {
    let docRef = firestore.collection("movies").doc(movieId);
    docRef.set(
      {
        comments: changComment
      },
      { merge: true }
    );
    dispatch(getComment(movieId));
  } catch (e) {
    dispatch({ type: GET_COMMENT_ERROR, error: e });
  }
};

export const resetComment = (movieId, id) => dispatch => {
  console.log("resetComment");
  try {
    movieId.forEach(item => {
      firestore
        .collection("movies")
        .doc(item)
        .get()
        .then(doc => {
          const comments = doc.data().comments;
          const changComment = comments.filter(comment => comment.id !== id);
          dispatch(updateComment(changComment, item));
        });
    });
  } catch (e) {}
};

const initialState = {
  visible: true,
  user: {
    login: false,
    id: null,
    name: null,
    provider: null,
    wishList: [],
    commentList: [],
    error: null
  },
  movies: {
    loading: false,
    error: null,
    date: "",
    showRange: [],
    period: null,
    movieList: []
  },
  movie: {
    loading: false,
    data: null,
    error: null
  },

  comments: []
};

export default function movies(state = initialState, action) {
  console.log("modules/movies");
  switch (action.type) {
    case SET_HEADER_VISIBILITY:
      return {
        ...state,
        visible: action.visible
      };
    case GET_USER_REQUEST:
      return {
        ...state,
        user: {
          login: state.user.login,
          id: null,
          name: null,
          provider: null,
          wishList: [],
          commentList: [],
          error: null
        }
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        user: {
          login: true,
          id: action.id,
          name: action.name,
          provider: action.provider,
          wishList: action.wishList,
          commentList: action.commentList,
          error: null
        }
      };
    case GET_USER_ERROR:
      return {
        ...state,
        user: {
          login: false,
          id: null,
          name: null,
          provider: null,
          wishList: [],
          commentList: [],
          error: action.error
        }
      };
    case SET_LOGOUT:
      return {
        ...state,
        user: {
          login: false,
          id: null,
          name: null,
          provider: null,
          wishList: [],
          commentList: [],
          error: null
        }
      };
    case GET_MOVIES_REQUEST:
      return {
        ...state,
        visible: true,
        movies: {
          loading: true,
          movieList: [],
          error: null,
          date: "",
          period: action.period,
          showRange: action.showRange
        }
      };
    case GET_MOVIES_SUCCESS:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          movieList: action.movieList,
          error: null,
          date: action.date,
          period: action.period,
          showRange: action.showRange
        }
      };
    case GET_MOVIES_ERROR:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          movieList: [],
          error: action.error,
          date: "",
          period: null
        }
      };
    case GET_MOVIE_REQUEST:
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
          data: action.payload,
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
    case GET_COMMENT_SUCCESS:
      return {
        ...state,
        comments: action.payload
      };
    case GET_COMMENT_ERROR:
      return {
        ...state,
        comments: []
      };

    default:
      return state;
  }
}
