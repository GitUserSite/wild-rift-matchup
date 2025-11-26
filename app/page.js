"use client";

import React from "react";

// Wild Rift Matchup – v2.1 with champion images
export default function WildRiftMatchupApp() {
  const languages = ["EN", "ES", "RU", "ZH", "AR"];
  const [selectedLang, setSelectedLang] = React.useState("EN");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLane, setSelectedLane] = React.useState("ALL");
  const [selectedChampion, setSelectedChampion] = React.useState(null); // null = homepage
  const [votes, setVotes] = React.useState({}); // {"champId-counterId": diff}
  const [theme, setTheme] = React.useState("dark"); // "dark" | "light"
  const [showPreviousPatch, setShowPreviousPatch] = React.useState(false);

  const currentPatch = "v6.3d";

  // Simple translations for core UI text
  const translations = {
    EN: {
      appTitle: "Wild Rift Matchup",
      searchPlaceholder: "Search champion...",
      noChampions: "No champions found.",
      allRoles: {
        ALL: "All",
        TOP: "Baron",
        JUNGLE: "Jungle",
        MID: "Mid",
        ADC: "Dragon",
        SUPPORT: "Support",
      },
      backToChampions: "Back to champions",
      countersLabel: "Counters",
      patch: "Patch",
      comparePrev: "Compare with previous patch",
      hidePrev: "Hide previous patch",
      communityScore: "Community score",
      previousPatchScore: "Previous patch score",
      noCounterData: "No counter data yet.",
      noPreviousPatchData: "No previous patch data.",
    },
    ES: {
      appTitle: "Matchup de Wild Rift",
      searchPlaceholder: "Buscar campeón...",
      noChampions: "No se encontraron campeones.",
      allRoles: {
        ALL: "Todos",
        TOP: "Barón",
        JUNGLE: "Jungla",
        MID: "Central",
        ADC: "Dragón",
        SUPPORT: "Soporte",
      },
      backToChampions: "Volver a campeones",
      countersLabel: "Counters",
      patch: "Versión",
      comparePrev: "Comparar con parche anterior",
      hidePrev: "Ocultar parche anterior",
      communityScore: "Puntuación de la comunidad",
      previousPatchScore: "Puntuación parche anterior",
      noCounterData: "Aún no hay datos de counters.",
      noPreviousPatchData: "Sin datos del parche anterior.",
    },
    RU: {
      appTitle: "Wild Rift матчапы",
      searchPlaceholder: "Поиск чемпиона...",
      noChampions: "Чемпионы не найдены.",
      allRoles: {
        ALL: "Все",
        TOP: "Барон",
        JUNGLE: "Лес",
        MID: "Мид",
        ADC: "Дракон",
        SUPPORT: "Саппорт",
      },
      backToChampions: "Назад к чемпионам",
      countersLabel: "Контрпики",
      patch: "Патч",
      comparePrev: "Сравнить с прошлым патчем",
      hidePrev: "Скрыть прошлый патч",
      communityScore: "Оценка сообщества",
      previousPatchScore: "Оценка прошлого патча",
      noCounterData: "Пока нет данных о контрпиках.",
      noPreviousPatchData: "Нет данных прошлого патча.",
    },
    ZH: {
      appTitle: "激斗峡谷克制查询",
      searchPlaceholder: "搜索英雄...",
      noChampions: "未找到英雄。",
      allRoles: {
        ALL: "全部",
        TOP: "上路",
        JUNGLE: "打野",
        MID: "中路",
        ADC: "下路",
        SUPPORT: "辅助",
      },
      backToChampions: "返回英雄列表",
      countersLabel: "克制英雄",
      patch: "版本",
      comparePrev: "与上个版本对比",
      hidePrev: "隐藏上个版本",
      communityScore: "玩家评分",
      previousPatchScore: "上个版本评分",
      noCounterData: "暂无克制数据。",
      noPreviousPatchData: "暂无上个版本数据。",
    },
    AR: {
      appTitle: "ماتش أب وايلد ريفت",
      searchPlaceholder: "ابحث عن بطل...",
      noChampions: "لم يتم العثور على أبطال.",
      allRoles: {
        ALL: "الكل",
        TOP: "بارون",
        JUNGLE: "غابة",
        MID: "منتصف",
        ADC: "تنين",
        SUPPORT: "داعم",
      },
      backToChampions: "العودة إلى الأبطال",
      countersLabel: "الكاونترز",
      patch: "إصدار",
      comparePrev: "قارن مع التحديث السابق",
      hidePrev: "إخفاء التحديث السابق",
      communityScore: "تقييم المجتمع",
      previousPatchScore: "تقييم التحديث السابق",
      noCounterData: "لا توجد بيانات حتى الآن.",
      noPreviousPatchData: "لا توجد بيانات للتحديث السابق.",
    },
  };

  const t = translations[selectedLang] || translations.EN;

  // Roles (labels come from translations)
  const roles = [
    { id: "ALL" },
    { id: "TOP" },
    { id: "JUNGLE" },
    { id: "MID" },
    { id: "ADC" },
    { id: "SUPPORT" },
  ];

  // Champion base list (English / canonical names)
  const champions = [
    { id: 1, name: "Ahri", role: "MID" },
    { id: 2, name: "Garen", role: "TOP" },
    { id: 3, name: "Lee Sin", role: "JUNGLE" },
    { id: 4, name: "Kai'Sa", role: "ADC" },
    { id: 5, name: "Thresh", role: "SUPPORT" },
  ];

  // --- IMAGE SETUP ---
  // You provided numeric IDs that map to champion icons:
  // 64  - Lee Sin
  // 86  - Garen
  // 103 - Ahri
  // 145 - Kai'Sa
  // 412 - Thresh
  // -1  - placeholder when an image is missing or corrupt
  //
  // In your real project, place these files for example in /public/champions
  // and keep the same numeric filenames:
  // /public/champions/64.png, 86.png, 103.png, 145.png, 412.png, -1.png

  const championIcons = {
    Ahri: "/champions/103.png",
    Garen: "/champions/86.png",
    "Lee Sin": "/champions/64.png",
    "Kai'Sa": "/champions/145.png",
    Thresh: "/champions/412.png",
  };

  const placeholderIcon = "/champions/-1.png";

  const getChampionIcon = (englishName) => {
    return championIcons[englishName] || placeholderIcon;
  };

  // Localized champion names (per language, keyed by EN name)
  const championLocalizedNames = {
    ES: {
      Ahri: "Ahri",
      Garen: "Garen",
      "Lee Sin": "Lee Sin",
      "Kai'Sa": "Kai'Sa",
      Thresh: "Thresh",
    },
    RU: {
      Ahri: "Ахри",
      Garen: "Гарен",
      "Lee Sin": "Ли Син",
      "Kai'Sa": "Кай'Са",
      Thresh: "Трэш",
    },
    ZH: {
      Ahri: "阿狸",
      Garen: "盖伦",
      "Lee Sin": "李青",
      "Kai'Sa": "卡莎",
      Thresh: "锤石",
    },
    AR: {
      Ahri: "آهري",
      Garen: "غارين",
      "Lee Sin": "لي سين",
      "Kai'Sa": "كاي سا",
      Thresh: "ثريش",
    },
  };

  const getChampionMainName = (englishName, lang) => {
    if (lang === "EN") return englishName;
    const localized = championLocalizedNames[lang]?.[englishName];
    return localized || englishName;
  };

  const getChampionDisplayName = (englishName, lang) => {
    if (lang === "EN") return englishName;
    const localized = championLocalizedNames[lang]?.[englishName];
    if (!localized || localized === englishName) return englishName;
    return `${localized} (${englishName})`;
  };

  const getChampionSearchStrings = (englishName, lang) => {
    const main = englishName.toLowerCase();
    const localized = championLocalizedNames[lang]?.[englishName]?.toLowerCase();
    return localized ? [main, localized] : [main];
  };

  // Very simple placeholder matchup data (who counters whom) – current patch
  // baseScore = higher means better counter
  const matchupData = {
    1: [ // Ahri
      { id: 2, name: "Garen", baseScore: 6 },
      { id: 3, name: "Lee Sin", baseScore: 4 },
      { id: 5, name: "Thresh", baseScore: 2 },
    ],
    2: [ // Garen
      { id: 3, name: "Lee Sin", baseScore: 7 },
      { id: 4, name: "Kai'Sa", baseScore: 3 },
      { id: 1, name: "Ahri", baseScore: 1 },
    ],
    3: [ // Lee Sin
      { id: 4, name: "Kai'Sa", baseScore: 5 },
      { id: 5, name: "Thresh", baseScore: 4 },
      { id: 2, name: "Garen", baseScore: 2 },
    ],
    4: [ // Kai'Sa
      { id: 5, name: "Thresh", baseScore: 6 },
      { id: 2, name: "Garen", baseScore: 3 },
      { id: 3, name: "Lee Sin", baseScore: 1 },
    ],
    5: [ // Thresh
      { id: 4, name: "Kai'Sa", baseScore: 6 },
      { id: 1, name: "Ahri", baseScore: 3 },
      { id: 3, name: "Lee Sin", baseScore: 2 },
    ],
  };

  // Placeholder previous patch data – can be the same or slightly different
  const previousMatchupData = {
    1: [
      { id: 2, name: "Garen", baseScore: 5 },
      { id: 3, name: "Lee Sin", baseScore: 5 },
      { id: 5, name: "Thresh", baseScore: 3 },
    ],
    2: [
      { id: 3, name: "Lee Sin", baseScore: 6 },
      { id: 4, name: "Kai'Sa", baseScore: 4 },
      { id: 1, name: "Ahri", baseScore: 2 },
    ],
    3: [
      { id: 4, name: "Kai'Sa", baseScore: 4 },
      { id: 5, name: "Thresh", baseScore: 4 },
      { id: 2, name: "Garen", baseScore: 3 },
    ],
    4: [
      { id: 5, name: "Thresh", baseScore: 7 },
      { id: 2, name: "Garen", baseScore: 2 },
      { id: 3, name: "Lee Sin", baseScore: 1 },
    ],
    5: [
      { id: 4, name: "Kai'Sa", baseScore: 5 },
      { id: 1, name: "Ahri", baseScore: 4 },
      { id: 3, name: "Lee Sin", baseScore: 2 },
    ],
  };

  const filteredChampions = champions.filter((champ) => {
    const matchesLane = selectedLane === "ALL" || champ.role === selectedLane;
    if (!matchesLane) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const searchStrings = getChampionSearchStrings(champ.name, selectedLang);
    return searchStrings.some((s) => s.includes(term));
  });

  const handleVote = (champId, counterId, direction) => {
    const key = `${champId}-${counterId}`;
    setVotes((prev) => {
      const current = prev[key] || 0;
      const delta = direction === "up" ? 1 : -1;
      return { ...prev, [key]: current + delta };
    });
  };

  const getCountersForChampion = (champ) => {
    if (!champ) return [];
    const list = matchupData[champ.id] || [];
    return [...list]
      .map((item) => {
        const key = `${champ.id}-${item.id}`;
        const diff = votes[key] || 0;
        return {
          ...item,
          score: item.baseScore + diff,
        };
      })
      .sort((a, b) => b.score - a.score); // highest score (best counter) on top
  };

  const getPreviousCountersForChampion = (champ) => {
    if (!champ) return [];
    const list = previousMatchupData[champ.id] || [];
    return [...list].sort((a, b) => b.baseScore - a.baseScore);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // --- Layouts ---

  const renderTopBar = () => (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4">
      <div className="text-lg font-semibold tracking-tight">{t.appTitle}</div>

      {/* Language selector + theme toggle */}
      <div className="flex flex-col items-end gap-1">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className={`border rounded-xl px-3 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
            ${theme === "dark"
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-300 text-slate-900"}
          `}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          onClick={toggleTheme}
          className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center border text-xs
            ${theme === "dark"
              ? "border-slate-600 text-slate-100 bg-slate-900"
              : "border-slate-300 text-slate-900 bg-white"}
          `}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☾" : "☀︎"}
        </button>
      </div>
    </header>
  );

  const renderHome = () => (
    <main className="flex-1 flex flex-col items-center px-4 sm:px-8 pb-8">
      {/* Search bar */}
      <div className="w-full max-w-xl mt-8">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border rounded-2xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500
            ${theme === "dark"
              ? "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"}
          `}
        />
      </div>

      {/* Role icons / buttons */}
      <div className="w-full max-w-xl mt-4 flex flex-wrap justify-center gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedLane(role.id)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border transition
              ${selectedLane === role.id
                ? "bg-sky-500 border-sky-500 text-slate-50"
                : theme === "dark"
                  ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                  : "bg-white border-slate-300 text-slate-600 hover:border-slate-500"}
            `}
          >
            {t.allRoles[role.id] || role.id}
          </button>
        ))}
      </div>

      {/* Champion grid with images */}
      <section className="w-full max-w-4xl mt-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {filteredChampions.map((champ) => {
            const displayName = getChampionDisplayName(champ.name, selectedLang);
            const iconSrc = getChampionIcon(champ.name);

            return (
              <button
                key={champ.id}
                onClick={() => setSelectedChampion(champ)}
                className={`group rounded-2xl border overflow-hidden flex flex-col items-stretch text-[11px] sm:text-xs md:text-sm font-medium transition
                  ${theme === "dark"
                    ? "bg-slate-900 border-slate-800 hover:border-sky-500 hover:bg-slate-900/80"
                    : "bg-white border-slate-200 hover:border-sky-500 hover:bg-slate-50"}
                `}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={iconSrc}
                    alt={displayName}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-150"
                    loading="lazy"
                  />
                </div>
                <div className="px-2 py-1.5 truncate text-center">
                  {displayName}
                </div>
              </button>
            );
          })}

          {filteredChampions.length === 0 && (
            <div className="col-span-full text-center text-sm text-slate-400 py-8">
              {t.noChampions}
            </div>
          )}
        </div>
      </section>
    </main>
  );

  const renderChampionCounters = () => {
    if (!selectedChampion) return null;

    const counters = getCountersForChampion(selectedChampion);
    const previousCounters = getPreviousCountersForChampion(selectedChampion);

    const championMainName = getChampionMainName(
      selectedChampion.name,
      selectedLang
    );
    const championDisplayName = getChampionDisplayName(
      selectedChampion.name,
      selectedLang
    );
    const championIcon = getChampionIcon(selectedChampion.name);

    return (
      <main className="flex-1 flex flex-col px-4 sm:px-8 pb-8 max-w-4xl w-full mx-auto">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedChampion(null);
            setShowPreviousPatch(false);
          }}
          className="mt-4 mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600"
        >
          <span className="text-lg">←</span>
          <span>{t.backToChampions}</span>
        </button>

        {/* Champion header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-2xl border overflow-hidden flex items-center justify-center text-xs font-semibold
                ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-300"}
              `}
            >
              {championIcon ? (
                <img
                  src={championIcon}
                  alt={championDisplayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{championMainName[0]}</span>
              )}
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
                {t.countersLabel}
              </div>
              <div
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-slate-50" : "text-slate-900"
                }`}
              >
                {championDisplayName}
              </div>
            </div>
          </div>

          {/* Patch info & compare link */}
          <div className="flex flex-col items-end text-right text-[11px] sm:text-xs">
            <div className="uppercase tracking-[0.16em] text-slate-500 mb-0.5">
              {t.patch}
            </div>
            <div className="font-semibold text-sky-400 mb-1">{currentPatch}</div>
            <button
              type="button"
              onClick={() => setShowPreviousPatch((prev) => !prev)}
              className="underline-offset-2 hover:underline text-sky-400"
            >
              {showPreviousPatch ? t.hidePrev : t.comparePrev}
            </button>
          </div>
        </div>

        {/* Counter list */}
        <section
          className={`mt-2 flex-1 rounded-2xl p-3 sm:p-4 border
            ${theme === "dark" ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}
          `}
        >
          {counters.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-6">
              {t.noCounterData}
            </div>
          ) : (
            <div className="max-h-[60vh] flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Current patch column */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                {counters.map((counter, index) => {
                  const counterMainName = getChampionMainName(
                    counter.name,
                    selectedLang
                  );
                  const counterDisplayName = getChampionDisplayName(
                    counter.name,
                    selectedLang
                  );
                  const counterIcon = getChampionIcon(counter.name);

                  return (
                    <div
                      key={`current-${counter.id}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border
                        ${theme === "dark"
                          ? "bg-slate-950/60 border-slate-800"
                          : "bg-slate-50 border-slate-200"}
                      `}
                    >
                      {/* Rank number */}
                      <div className="w-6 text-xs text-slate-500 text-right">
                        #{index + 1}
                      </div>

                      {/* Icon + name */}
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className={`h-8 w-8 rounded-xl border overflow-hidden flex items-center justify-center text-[11px] font-semibold
                            ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-300"}
                          `}
                        >
                          {counterIcon ? (
                            <img
                              src={counterIcon}
                              alt={counterDisplayName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{counterMainName[0]}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`font-medium text-xs sm:text-sm ${
                              theme === "dark" ? "text-slate-50" : "text-slate-900"
                            }`}
                          >
                            {counterDisplayName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {t.communityScore}
                          </span>
                        </div>
                      </div>

                      {/* Score + vote buttons */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs sm:text-sm font-semibold tabular-nums mr-1 ${
                            theme === "dark" ? "text-slate-100" : "text-slate-900"
                          }`}
                        >
                          {counter.score}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() =>
                              handleVote(selectedChampion.id, counter.id, "up")
                            }
                            className="h-5 w-6 flex items-center justify-center rounded-md border border-slate-700 text-[10px] hover:border-sky-500 hover:bg-slate-900/80"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() =>
                              handleVote(selectedChampion.id, counter.id, "down")
                            }
                            className="h-5 w-6 flex items-center justify-center rounded-md border border-slate-700 text-[10px] hover:border-sky-500 hover:bg-slate-900/80"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Previous patch column */}
              {showPreviousPatch && (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pl-1">
                  {previousCounters.length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-6">
                      {t.noPreviousPatchData}
                    </div>
                  ) : (
                    previousCounters.map((counter, index) => {
                      const counterMainName = getChampionMainName(
                        counter.name,
                        selectedLang
                      );
                      const counterDisplayName = getChampionDisplayName(
                        counter.name,
                        selectedLang
                      );
                      const counterIcon = getChampionIcon(counter.name);

                      return (
                        <div
                          key={`previous-${counter.id}`}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border opacity-80
                            ${theme === "dark"
                              ? "bg-slate-950/40 border-slate-800"
                              : "bg-slate-50 border-slate-200"}
                          `}
                        >
                          {/* Rank number */}
                          <div className="w-6 text-xs text-slate-500 text-right">
                            #{index + 1}
                          </div>

                          {/* Icon + name */}
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={`h-8 w-8 rounded-xl border overflow-hidden flex items-center justify-center text-[11px] font-semibold
                                ${theme === "dark"
                                  ? "bg-slate-900 border-slate-700"
                                  : "bg-slate-100 border-slate-300"}
                              `}
                            >
                              {counterIcon ? (
                                <img
                                  src={counterIcon}
                                  alt={counterDisplayName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span>{counterMainName[0]}</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`font-medium text-xs sm:text-sm ${
                                  theme === "dark" ? "text-slate-50" : "text-slate-900"
                                }`}
                              >
                                {counterDisplayName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {t.previousPatchScore}
                              </span>
                            </div>
                          </div>

                          {/* Score (no voting buttons) */}
                          <div className="flex items-center">
                            <span className="text-xs sm:text-sm font-semibold tabular-nums text-slate-300">
                              {counter.baseScore}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {renderTopBar()}
      {selectedChampion ? renderChampionCounters() : renderHome()}
    </div>
  );
}
