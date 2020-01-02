import actions from './store/actions';
import mutations from './store/mutations';
import initialState from './store/state';
import Store from './store/store';

export default new Store({
  actions,
  mutations,
  initialState,
});
