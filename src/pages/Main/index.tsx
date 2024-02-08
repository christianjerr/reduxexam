import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as model from "../../redux/models";
import * as actions from "../../redux/actions";
import { itemRes, itemStates } from "../../redux/selectors";

const Main = () => {
  const [initialStates, setInitialStates] = useState("NEW SOUTH WALES");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getItem.request({}));
  }, [dispatch]);

  const initial = useSelector((state: model.InitialStateTypes) =>
    itemRes(state)
  );

  const statesSelector = useSelector((state: model.InitialStateTypes) =>
    itemStates(state)
  );

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInitialStates("");
      setInitialStates(e.target.value);
    },
    []
  );

  const memoizeCountries = useMemo(() => {
    return initial.map((item) => (
      <select
        key={item.id}
        className="w-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option>{item.name}</option>
      </select>
    ));
  }, [initial]);

  const memoizeState = useMemo(() => {
    return initial.map((item) => (
      <select
        key={item.id}
        onChange={handleStateChange}
        className="w-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {item.states.map((state) => (
          <option key={state.code}>{state.name}</option>
        ))}
      </select>
    ));
  }, [handleStateChange, initial]);

  const memoizedCities = useMemo(() => {
    const selected = statesSelector.map((item) =>
      item.filter((s) => s.name === initialStates)
    );

    return selected[0].map((item) => (
      <ul
        key={item.code}
        className="grid grid-cols-2 gap-10 md:gap-20 md:grid-cols-4 text-gray-50"
      >
        {item.cities.map((ci) => (
          <div
            key={ci.name}
            className="bg-blue-500 p-2 rounded-lg color-white md:p-5"
          >
            <li className="text-xl md:text-3xl">{ci.name}</li>
            <br />
            <li>
              {ci.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </li>
            <li>Citizens</li>
            <br />
          </div>
        ))}
      </ul>
    ));
  }, [initialStates, statesSelector]);

  const memoizeTotalCitizens = useMemo(() => {
    const selected = statesSelector.map((item) =>
      item.filter((s) => s.name === initialStates)
    );
    const cities = selected[0].map((item) => item.cities);

    var sum = cities[0]?.reduce((a: any, b: any) => {
      return a + b.population;
    }, 0);
    return sum;
  }, [initialStates, statesSelector]);

  return (
    <div className="p-10 bg-blue-100">
      <div className="grid grid-cols-2 gap-20 pb-20">
        {memoizeCountries}
        {memoizeState}
      </div>
      <p className="text-lg md:text-4xl">
        Total Citizen:{" "}
        {memoizeTotalCitizens?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </p>
      <p className="text-left pb-10 text-lg md:text-2xl">Cities:</p>
      {memoizedCities}
    </div>
  );
};
export default Main;
