import axios from "axios";
import moment from "moment";
import firestore from "../Firestore";

const SET_HEADER_VISIBILITY = "SET_HEADER_VISIBILITY";

const SET_LOGIN = "SET_LOGIN";
const SET_LOGIN_SUCCESS = "SET_LOGIN_SUCCESS";
const SET_LOGIN_ERROR = "SET_LOGIN_ERROR";
const SET_LOGOUT = "SET_LOGOUT";

const GET_USER = "GET_USER";

const GET_MOVIES = "GET_MOVIES";
const GET_MOVIES_SUCCESS = "GET_MOVIES_SUCCESS";
const GET_MOVIES_ERROR = "GET_MOVIES_ERROR";

const GET_MOVIE = "GET_MOVIE";
const GET_MOVIE_SUCCESS = "GET_MOVIE_SUCCESS";
const GET_MOVIE_ERROR = "GET_MOVIE_ERROR";

const GET_COMMENT_SUCCESS = "GET_COMMENT_SUCCESS";
const GET_COMMENT_ERROR = "GET_COMMENT_ERROR";

export const goToPath = path => (dispatch, getState, { history }) => {
  history.push(path);
};

export const setHeaderVisibility = visible => async dispatch => {
  console.log("modules/setHeaderVisibility");
  dispatch({ type: SET_HEADER_VISIBILITY, visible });
};

export const setLogin = (provider, id, name) => async dispatch => {
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

    // dispatch({ type: SET_LOGIN_SUCCESS, id, provider, name });
  } catch (e) {
    dispatch({ type: SET_LOGIN_ERROR });
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
  } catch (e) {}
};

export const getUser = id => dispatch => {
  console.log("getUser");
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
            type: GET_USER,
            id,
            name,
            provider,
            reg_date,
            wishList,
            commentList
          });
        });
      });
  } catch (e) {}
};

export const setLogout = () => async dispatch => {
  window.sessionStorage.clear();
  dispatch(goToPath("/"));
  dispatch({ type: SET_LOGOUT });
};

export const getMovies = (period, date) => async (dispatch, getState) => {
  console.log("getMovies");
  console.log(period);
  console.log(date);
  dispatch({ type: GET_MOVIES });

  let { movieList } = getState().movies.movies;
  const key = "8512edd89b714bf2cf35fcb50adac48d";
  let rankingData = [];
  let showRange;

  const getRankingData = async api => {
    const {
      data: { boxOfficeResult }
    } = await axios.get(
      `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/${api}.json`,
      {
        params: {
          key,
          targetDt: date,
          weekGb: 0
        }
      }
    );
    showRange = boxOfficeResult.showRange.split("~");
    return boxOfficeResult;
  };

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

  const getData = rankingData => {
    return new Promise(resolve => {
      firestore
        .collection("movies")
        .doc(rankingData.movieCd)
        .get()
        .then(doc => {
          if (!doc.exists) {
            setMovies(rankingData).then(data => resolve(getData(data)));
          } else {
            resolve(doc.data());
          }
        });
    });
  };

  const getMovieList = () => {
    for (let i = 0; i < rankingData.length; i++) {
      movieList.push(getData(rankingData[i]));
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

  if (period === "daily") {
    getRankingData("searchDailyBoxOfficeList").then(data => {
      rankingData = data.dailyBoxOfficeList;
      getMovieList();
    });
  } else {
    getRankingData("searchWeeklyBoxOfficeList").then(data => {
      rankingData = data.weeklyBoxOfficeList;
      getMovieList();
    });
  }
};

export const getMovie = movieId => async dispatch => {
  console.log("modules/getMovie");
  dispatch({ type: GET_MOVIE });
  try {
    firestore
      .collection("movies")
      .doc(movieId)
      .get()
      .then(doc => {
        const payload = doc.data();
        console.log(payload);
        dispatch({ type: GET_MOVIE_SUCCESS, payload });
      });
  } catch (e) {
    dispatch({ type: GET_MOVIE_ERROR, error: e });
  }
};

export const getComment = movieId => async dispatch => {
  console.log("getComment");
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
    commentList: []
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
    case SET_LOGIN:
      return {
        ...state,
        user: {
          login: false,
          id: null,
          type: null
        }
      };
    case SET_LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          login: true,
          id: action.id,
          name: action.name,
          provider: action.provider
        }
      };
    case SET_LOGIN_ERROR:
      return {
        ...state,
        user: {
          login: false,
          id: null
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
          commentList: []
        }
      };

    case GET_USER:
      return {
        ...state,
        user: {
          login: true,
          id: action.id,
          name: action.name,
          provider: action.provider,
          wishList: action.wishList,
          commentList: action.commentList
        }
      };

    case GET_MOVIES:
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
