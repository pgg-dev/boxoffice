// import axios from "axios";
import moment from "moment";

// export const createPromiseThunk = type => {
//   console.log("asyncUtils/createPromiseThunk");
//   const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

//   return param => async dispatch => {
//     dispatch({ type, param });

//     await axios
//       .get(
//         "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
//         {
//           params: {
//             key: "8512edd89b714bf2cf35fcb50adac48d",
//             targetDt: param
//           }
//         }
//       )
//       .then(data => {
//         const payload = data.data.boxOfficeResult.dailyBoxOfficeList;
//         console.log(payload);
//         dispatch({ type: SUCCESS, payload });
//       })
//       .catch(e => {
//         dispatch({ type: ERROR, error: true });
//       });
//   };
// };

export const reducerUtils = {
  initial: (initialData = null) => ({
    loading: false,
    data: initialData,
    error: null,
    date: moment().format("YYYYMMDD") - 1
  }),
  loading: (prevState = null) => ({
    //prevState : 로딩 값만 바꾸기 위해
    loading: true,
    data: prevState,
    error: null,
    date: moment().format("YYYYMMDD") - 1
  }),
  success: payload => ({
    loading: false,
    data: payload,
    error: null,
    date: moment().format("YYYYMMDD") - 1
  }),
  error: error => ({
    loading: false,
    data: null,
    error: error,
    date: moment().format("YYYYMMDD") - 1
  })
};
