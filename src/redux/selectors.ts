import { createSelector } from "reselect";
import * as models from "./models";

export const rootState = (state: models.InitialStateTypes) => state;

export const itemRes = createSelector(
  rootState,
  (rootState: models.InitialStateTypes) => {
    return rootState.itemInitial || models.InitialState.itemInitial;
  }
);

