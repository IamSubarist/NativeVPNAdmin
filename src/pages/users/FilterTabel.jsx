import React, { useContext, useEffect, useState } from "react";
import { Select, Input } from "antd";
import { KeenIcon } from "../../components/keenicons";
import { FilterContext } from "../../providers/FilterProvider";
import axiosInstance from "@/axiosConfig";
import { useLocation } from "react-router-dom";
import { SingleDateTimePicker } from "../dashboard/blocks/SingleDateTimePicker";

const FilterTabel = () => {
  const { filterOptions, addFilter, removeFilter, clearFilters } =
    useContext(FilterContext);

  const [searchKey, setSearchKey] = useState(""); // дефолтное значение — 'Все'
  const [prevSearchKey, setPrevSearchKey] = useState(null);

  const [search, setSearch] = useState("");
  const [valueMin, setValueMin] = useState(null);
  const [valueMax, setValueMax] = useState(null);

  const [giveawaysData, setGiveawaysData] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [gamesportStatus, setGamesportStatus] = useState(null);
  const [giveawayValue, setGiveawayValue] = useState(null);

  // Состояния для новых фильтров
  const [replenishmentFrom, setReplenishmentFrom] = useState("");
  const [replenishmentTo, setReplenishmentTo] = useState("");
  const [daysAccessFrom, setDaysAccessFrom] = useState("");
  const [daysAccessTo, setDaysAccessTo] = useState("");
  const [referralsFrom, setReferralsFrom] = useState("");
  const [referralsTo, setReferralsTo] = useState("");
  const [giftsFrom, setGiftsFrom] = useState("");
  const [giftsTo, setGiftsTo] = useState("");

  const location = useLocation();

  useEffect(() => {
    clearFilters();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchKeys = ["email", "tg_id", "vk_id", "id"]; // добавляем id

    for (const key of searchKeys) {
      const value = params.get(key);
      if (value) {
        setSearchKey(key);
        setSearch(value);
        addFilter(key, value);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const getGiveaways = async () => {
      try {
        const response = await axiosInstance.get(
          "https://vpnbot.sjp-asia.group/admin_panel/api/info/giveaways"
        );
        setGiveawaysData(response.data);
        console.log("getGiveaways", response.data);
      } catch (error) {
        console.error("Error fetching giveaways:", error);
      }
    };
    getGiveaways();
  }, []);

  const handleFilterOption = () => {
    // Удаляем все возможные фильтры по ID/email
    ["email", "tg_id", "vk_id", "id"].forEach((key) => removeFilter(key));

    // Если выбран не 'Все' и поле не пустое — добавляем фильтр
    if (searchKey && search.trim() !== "") {
      let cleanedSearch = search.trim();

      // Если ищем по Telegram ID — удаляем @ перед отправкой
      if (searchKey === "tg_id" && cleanedSearch.startsWith("@")) {
        cleanedSearch = cleanedSearch.slice(1);
      }

      addFilter(searchKey, cleanedSearch);
    }

    if (valueMin !== null && valueMin !== undefined && valueMin !== "") {
      addFilter("min_balance", valueMin);
    } else {
      removeFilter("min_balance");
    }

    if (valueMax !== null && valueMax !== undefined && valueMax !== "") {
      addFilter("max_balance", valueMax);
    } else {
      removeFilter("max_balance");
    }

    // Новые фильтры
    if (replenishmentFrom !== "") {
      addFilter("min_sum_balances", replenishmentFrom);
    } else {
      removeFilter("min_sum_balances");
    }

    if (replenishmentTo !== "") {
      addFilter("max_sum_balances", replenishmentTo);
    } else {
      removeFilter("max_sum_balances");
    }

    if (daysAccessFrom !== "") {
      addFilter("min_days_access", daysAccessFrom);
    } else {
      removeFilter("min_days_access");
    }

    if (daysAccessTo !== "") {
      addFilter("max_days_access", daysAccessTo);
    } else {
      removeFilter("max_days_access");
    }

    if (referralsFrom !== "") {
      addFilter("min_referrals", referralsFrom);
    } else {
      removeFilter("min_referrals");
    }

    if (referralsTo !== "") {
      addFilter("max_referrals", referralsTo);
    } else {
      removeFilter("max_referrals");
    }

    if (giftsFrom !== "") {
      addFilter("min_gifts_sent", giftsFrom);
    } else {
      removeFilter("min_gifts_sent");
    }

    if (giftsTo !== "") {
      addFilter("max_gifts_sent", giftsTo);
    } else {
      removeFilter("max_gifts_sent");
    }

    // Фильтры обновлены, DataGrid сам сделает запрос
  };

  const searchOptions = [
    { label: "Все", value: "" },
    { label: "ID", value: "id" },
    { label: "Telegram", value: "tg_id" },
    { label: "Email", value: "email" },
    { label: "Vk", value: "vk_id" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFilterOption();
      }}
      className="mb-4"
    >
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="input w-3/4">
            <i className="ki-outline ki-magnifier"></i>
            <input
              type="text"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilterOption();
                }
              }}
            />
          </div>
          <div className="flex gap-4 w-1/4 flex-col lg:flex-row">
            <div className="w-full relative">
              <label
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                  display: "inline",
                  marginBottom: "0px",
                }}
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              >
                По параметрам
              </label>
              <Select
                className="input ps-0 pe-0 border-none"
                options={searchOptions}
                value={searchKey}
                onChange={(value) => {
                  setPrevSearchKey(searchKey); // запоминаем старое значение
                  setSearchKey(value); // обновляем новое значение
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex gap-4 w-[77px]">
              <button type="submit" className="btn btn-outline btn-primary">
                Искать
              </button>
            </div>
          </div>
        </div>

        <hr />

        {/* Новая строка с фильтрами */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Сумма пополнений */}
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Сумма пополнений от
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={replenishmentFrom}
                  onChange={(e) => setReplenishmentFrom(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  до
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={replenishmentTo}
                  onChange={(e) => setReplenishmentTo(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* Дней доступа */}
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Дней доступа от
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={daysAccessFrom}
                  onChange={(e) => setDaysAccessFrom(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  до
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={daysAccessTo}
                  onChange={(e) => setDaysAccessTo(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* Кол-во рефералов */}
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Кол-во рефералов от
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={referralsFrom}
                  onChange={(e) => setReferralsFrom(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  до
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={referralsTo}
                  onChange={(e) => setReferralsTo(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
            </div>
          </div>

          {/* Подарков */}
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Подарков от
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={giftsFrom}
                  onChange={(e) => setGiftsFrom(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1 relative">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
               before:content-[''] before:absolute before:top-1/2 before:left-0
               before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  до
                </label>
                <Input
                  placeholder="0"
                  className="input w-full"
                  value={giftsTo}
                  onChange={(e) => setGiftsTo(e.target.value)}
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-6">
          <button
            type="button"
            className="btn btn-danger btn-outline transition-all duration-300"
            onClick={() => {
              setSearchKey("");
              setSearch("");
              setValueMin(null);
              setValueMax(null);
              setSubscriptionType(null);
              setGamesportStatus(null);
              setGiveawayValue(null);
              setReplenishmentFrom("");
              setReplenishmentTo("");
              setDaysAccessFrom("");
              setDaysAccessTo("");
              setReferralsFrom("");
              setReferralsTo("");
              setGiftsFrom("");
              setGiftsTo("");
              clearFilters();
            }}
          >
            Сбросить
          </button>
          <button className="btn btn-primary btn-outline transition-all duration-300">
            Применить
          </button>
        </div>
      </div>
    </form>
  );
};

export { FilterTabel };
