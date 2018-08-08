const mutations = {
  isShow: (state,bool) => state.toastShow = bool=='true' ? true : false,
  campaignTokenUpdate: (state,nVal) => state.campToken = nVal ? nVal : state.campToken,
  doErrShow: (state,bool) => state.errShow = bool == 'true' ? true : false,
  doInfoShow: (state,bool) => state.infoShow = bool == 'true' ? true : false,
  doRecordingShow: (state,bool) => state.recordingShow = bool =='true' ? true : false,
  doAdRepShow: (state,bool) => state.adRepShow = bool =='true' ? true : false,
  getServerTime: (state, time) => state.serverTime = time
}

export default mutations;
