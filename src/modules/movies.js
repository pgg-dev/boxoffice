import axios from "axios";
import moment from "moment";
import firestore from "../Firestore";

const SET_HEADER_VISIBILITY = "SET_HEADER_VISIBILITY";
const SET_STAR_RATING = "SET_STAR_RATING";

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

export const setLogin = (provider, id, name) => async dispatch => {
  console.log("modules/setLogin");
  console.log("////////////");
  console.log(name);
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
              id: id,
              name: name,
              reg_date: moment().format("YYYYMMDD")
            },
            { merge: true }
          );
        }
      });
    dispatch({ type: SET_LOGIN_SUCCESS, id, provider, name });
  } catch (e) {
    dispatch({ type: SET_LOGIN_ERROR });
  }
};

export const setLogout = () => async dispatch => {
  dispatch({ type: SET_LOGOUT });
};

const setMovies = rankingData => {
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

          if (detailData.rating[0].ratingGrade.includes("|"))
            detailData.rating[0].ratingGrade = detailData.rating[0].ratingGrade.substring(
              0,
              detailData.rating[0].ratingGrade.indexOf("|")
            );

          let docRef = firestore.collection("movies").doc(rankingData.movieCd);
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

export const getMovies = (date, period, next) => async dispatch => {
  const key = "8512edd89b714bf2cf35fcb50adac48d";
  let rankingData;
  let dailyData = [];
  let weeklyData = [];
  let showRange;
  dispatch({ type: GET_MOVIES });

  if (date === "" || !date) {
    date = moment().format("YYYYMMDD") - 1;
  }

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

  if (period === "daily") {
    await getRankingData("searchDailyBoxOfficeList").then(
      data => (rankingData = data.dailyBoxOfficeList)
    );
  } else {
    await getRankingData("searchWeeklyBoxOfficeList").then(
      data => (rankingData = data.weeklyBoxOfficeList)
    );
  }

  for (let i = 0; i < rankingData.length; i++) {
    await getData(rankingData[i]).then(async data => {
      if (period === "daily") {
        dailyData.push(data);
        window.localStorage.setItem(period, JSON.stringify(dailyData));
      } else {
        weeklyData.push(data);
        window.localStorage.setItem(period, JSON.stringify(weeklyData));
      }
    });
  }

  dispatch({
    type: GET_MOVIES_SUCCESS,
    date,
    period,
    showRange,
    dailyData,
    weeklyData,
    next
  });
};

export const getMovie = movieId => async dispatch => {
  console.log("modules/getMovie");
  dispatch({ type: GET_MOVIE });
  try {
    dispatch({ type: GET_MOVIE_SUCCESS, movieId });
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

export const addComment = (changComment, movieId) => async dispatch => {
  console.log("addComment");
  console.log(changComment);
  console.log(movieId);
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

export const deleteComment = (movieId, id) => async dispatch => {
  console.log(movieId);
  console.log(id);
  try {
    let docRef = firestore.collection("movies").doc(movieId);
    docRef.get().then(doc => {
      const comments = doc.data().comments;
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === id) {
          docRef
            .update({
              comments: comments.filter(comment => comment.id !== id)
            })
            .then(dispatch(getComment(movieId)));
        }
      }
    });
  } catch (e) {
    dispatch({ type: GET_COMMENT_ERROR, error: e });
  }
};

export const setStarRating = star => dispatch => {
  dispatch({ type: SET_STAR_RATING, star });
};
const initialState = {
  visible: true,
  login: {
    status: false,
    id: null,
    name: null,
    provider: null
  },
  movies: {
    loading: false,
    dailyData: null,
    weeklyData: null,
    error: null,
    date: "",
    showRange: null,
    period: null,
    next: false
  },
  movie: {
    loading: false,
    data: null,
    error: null
  },

  comments: [],
  star: ""
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
          name: action.name,
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
          dailyData: null,
          weeklyData: null,
          error: null,
          date: "",
          period: action.period,
          showRange: action.showRange,
          next: false
        }
      };
    case GET_MOVIES_SUCCESS:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          dailyData: action.dailyData,
          weeklyData: action.weeklyData,
          error: null,
          date: action.date,
          period: action.period,
          showRange: action.showRange,
          next: action.next
        }
      };
    case GET_MOVIES_ERROR:
      return {
        ...state,
        visible: true,
        movies: {
          loading: false,
          dailyData: null,
          weeklyData: null,
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
          data:
            state.movies.period === "daily"
              ? state.movies.dailyData.find(
                  movie => movie.id === action.movieId
                )
              : state.movies.weeklyData.find(
                  movie => movie.id === action.movieId
                ),
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
    case SET_STAR_RATING:
      return {
        ...state,
        star: action.star
      };

    default:
      return state;
  }
}
