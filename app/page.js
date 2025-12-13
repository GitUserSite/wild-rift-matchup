"use client";

import React from "react";
import { supabase } from "../lib/supabaseClient";
import { championLocalizedNames } from "./championLocalizedNames";

// Wild Rift Matchup – v2.1 with champion images
export default function WildRiftMatchupApp() {
  const languages = ["EN", "ES", "RU", "ZH", "AR"];
  const [selectedLang, setSelectedLang] = React.useState("EN");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLane, setSelectedLane] = React.useState("ALL");
  const [selectedChampion, setSelectedChampion] = React.useState(null); // null = homepage
  const [voteTotals, setVoteTotals] = React.useState({}); // { "relation:champId-opponentId": { up, down } }
  const [editingVoteKey, setEditingVoteKey] = React.useState(null);
  const [editUp, setEditUp] = React.useState("");
  const [editDown, setEditDown] = React.useState("");
  const [theme, setTheme] = React.useState("dark"); // "dark" | "light"
  const [showPreviousPatch, setShowPreviousPatch] = React.useState(false);
  const [isReversed, setIsReversed] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [authError, setAuthError] = React.useState("");
  const [authEmail, setAuthEmail] = React.useState("");
  const [authPassword, setAuthPassword] = React.useState("");
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  const isAdmin = !!user && user.email === ADMIN_EMAIL;

  const [patchLabel, setPatchLabel] = React.useState("v6.3e");
  const [isEditingPatch, setIsEditingPatch] = React.useState(false);
  const [patchInput, setPatchInput] = React.useState("v6.3e");

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
      previousPatchScore: "Previous patch score (counters)",
      bestSynergyLabel: "Best synergy",
      countersAndSynergiesLabel: "Counters & Synergies",
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
      previousPatchScore: "Puntuación parche anterior (counters)",
      bestSynergyLabel: "Mejor sinergia",
      countersAndSynergiesLabel: "Counters y sinergias",
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
      previousPatchScore: "Оценка прошлого патча (контрпики)",
      bestSynergyLabel: "Лучшая синергия",
      countersAndSynergiesLabel: "Контрпики и синергии",
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
      previousPatchScore: "上个版本评分（克制）",
      bestSynergyLabel: "最佳配合",
      countersAndSynergiesLabel: "克制与配合",
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
      previousPatchScore: "تقييم التحديث السابق (الكونترات)",
      bestSynergyLabel: "أفضل تناغم",
      countersAndSynergiesLabel: "الكونترات والتناغمات",
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

  React.useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.warn("Supabase getUser error", error.message);
        return;
      }
      setUser(data.user ?? null);
    }
    loadUser();
  }, []);

  React.useEffect(() => {
    async function loadVotes() {
      const { data, error } = await supabase
        .from("votes")
        .select("champion_id, opponent_id, relation_type, up_votes, down_votes");

      if (error) {
        console.warn("Supabase votes load error", error.message);
        return;
      }

      const aggregatedVotes = {};

      (data || []).forEach((row) => {
        const up = row.up_votes ?? 0;
        const down = row.down_votes ?? 0;
        const key = `${row.relation_type}:${row.champion_id}-${row.opponent_id}`;
        aggregatedVotes[key] = { up, down };
      });

      setVoteTotals(aggregatedVotes);
    }

    loadVotes();
  }, []);

  React.useEffect(() => {
    async function loadPatchLabel() {
      const { data, error } = await supabase
        .from("app_settings")
        .select("setting_value")
        .eq("setting_key", "current_patch")
        .maybeSingle();

      if (error) {
        console.warn("Supabase app_settings load error", error.message);
        return;
      }

      if (data?.setting_value) {
        setPatchLabel(data.setting_value);
        setPatchInput(data.setting_value);
      }
    }

    loadPatchLabel();
  }, []);

  const COMMUNITY_DRAGON_BASE = "https://raw.communitydragon.org/latest";

  // Champion base list (English / canonical names) 
  // The ones aren't in Wild RIft yet, are commented out
  const championBaseList = [
    { id: 266, name: "Aatrox", roles: ["TOP", "JUNGLE"] },
    { id: 103, name: "Ahri", roles: ["MID"] },
    { id: 84, name: "Akali", roles: ["MID", "TOP"] },
    { id: 166, name: "Akshan", roles: ["MID"] },
    { id: 12, name: "Alistar", roles: ["SUPPORT"] },
    { id: 799, name: "Ambessa", roles: ["TOP", "JUNGLE"] },
    { id: 32, name: "Amumu", roles: ["TOP", "JUNGLE", "SUPPORT"] },
    //{ id: 34, name: "Anivia", roles: ["MID"] },
    { id: 1, name: "Annie", roles: ["MID"] },
    //{ id: 523, name: "Aphelios", roles: ["ADC"] },
    { id: 22, name: "Ashe", roles: ["ADC", "SUPPORT"] },
    { id: 136, name: "Aurelion Sol", roles: ["MID"] },
    { id: 893, name: "Aurora", roles: ["MID", "TOP"] },
    { id: 432, name: "Bard", roles: ["SUPPORT"] },
    { id: 53, name: "Blitzcrank", roles: ["SUPPORT"] },
    { id: 63, name: "Brand", roles: ["MID", "SUPPORT"] },
    { id: 201, name: "Braum", roles: ["SUPPORT"] },
    { id: 51, name: "Caitlyn", roles: ["ADC"] },
    { id: 164, name: "Camille", roles: ["TOP", "JUNGLE"] },
    //{ id: 31, name: "Cho'Gath", roles: ["TOP"] },
    { id: 42, name: "Corki", roles: ["ADC", "MID"] },
    { id: 122, name: "Darius", roles: ["TOP", "JUNGLE"] },
    { id: 131, name: "Diana", roles: ["MID", "TOP", "JUNGLE"] },
    { id: 36, name: "Dr. Mundo", roles: ["TOP", "JUNGLE"] },
    { id: 119, name: "Draven", roles: ["ADC"] },
    { id: 245, name: "Ekko", roles: ["MID", "TOP", "JUNGLE"] },
    { id: 28, name: "Evelynn", roles: ["JUNGLE"] },
    { id: 81, name: "Ezreal", roles: ["ADC"] },
    { id: 9, name: "Fiddlesticks", roles: ["JUNGLE"] },
    { id: 114, name: "Fiora", roles: ["TOP"] },
    { id: 105, name: "Fizz", roles: ["MID", "TOP", "JUNGLE"] },
    { id: 3, name: "Galio", roles: ["MID", "SUPPORT"] },
    //{ id: 41, name: "Gangplank", roles: ["TOP"] },
    { id: 86, name: "Garen", roles: ["TOP"] },
    { id: 79, name: "Gragas", roles: ["TOP", "JUNGLE"] },
    { id: 104, name: "Graves", roles: ["TOP", "JUNGLE"] },
    { id: 887, name: "Gwen", roles: ["TOP", "JUNGLE"] },
    { id: 150, name: "Gnar", roles: ["TOP"] },
    { id: 120, name: "Hecarim", roles: ["JUNGLE"] },
    { id: 74, name: "Heimerdinger", roles: ["MID"] },
    { id: 39, name: "Irelia", roles: ["TOP", "MID"] },
    { id: 40, name: "Janna", roles: ["SUPPORT"] },
    { id: 59, name: "Jarvan IV", roles: ["TOP", "JUNGLE"] },
    { id: 24, name: "Jax", roles: ["TOP", "JUNGLE"] },
    { id: 126, name: "Jayce", roles: ["TOP", "MID"] },
    { id: 202, name: "Jhin", roles: ["ADC"] },
    { id: 222, name: "Jinx", roles: ["ADC"] },
    { id: 145, name: "Kai'Sa", roles: ["ADC"] },
    { id: 429, name: "Kalista", roles: ["ADC"] },
    { id: 43, name: "Karma", roles: ["SUPPORT", "MID"] },
    //{ id: 30, name: "Karthus", roles: ["JUNGLE"] },
    { id: 38, name: "Kassadin", roles: ["MID", "TOP"] },
    { id: 55, name: "Katarina", roles: ["MID"] },
    { id: 10, name: "Kayle", roles: ["TOP", "MID"] },
    { id: 141, name: "Kayn", roles: ["JUNGLE"] },
    { id: 85, name: "Kennen", roles: ["TOP", "MID"] },
    { id: 121, name: "Kha'Zix", roles: ["JUNGLE"] },
    { id: 203, name: "Kindred", roles: ["JUNGLE"] },
    { id: 96, name: "Kog'Maw", roles: ["ADC"] },
    //{ id: 7, name: "LeBlanc", roles: ["MID"] },
    { id: 64, name: "Lee Sin", roles: ["JUNGLE"] },
    { id: 876, name: "Lillia", roles: ["JUNGLE"] },
    { id: 89, name: "Leona", roles: ["SUPPORT"] },
    { id: 127, name: "Lissandra", roles: ["MID"] },
    { id: 236, name: "Lucian", roles: ["ADC", "MID"] },
    { id: 117, name: "Lulu", roles: ["SUPPORT"] },
    { id: 99, name: "Lux", roles: ["MID", "SUPPORT"] },
    { id: 54, name: "Malphite", roles: ["TOP", "MID", "SUPPORT"] },
    { id: 57, name: "Maokai", roles: ["SUPPORT", "TOP", "JUNGLE"] },
    { id: 11, name: "Master Yi", roles: ["JUNGLE"] },
    { id: 21, name: "Miss Fortune", roles: ["ADC"] },
    { id: 82, name: "Mordekaiser", roles: ["TOP", "JUNGLE"] },
    { id: 25, name: "Morgana", roles: ["SUPPORT", "MID", "JUNGLE"] },
    { id: 902, name: "Milio", roles: ["SUPPORT"] },
    { id: 267, name: "Nami", roles: ["SUPPORT"] },
    { id: 75, name: "Nasus", roles: ["TOP"] },
    { id: 111, name: "Nautilus", roles: ["SUPPORT", "TOP", "JUNGLE"] },
    { id: 76, name: "Nidalee", roles: ["JUNGLE", "TOP"] },
    { id: 895, name: "Nilah", roles: ["ADC"] },
    { id: 56, name: "Nocturne", roles: ["JUNGLE"] },
    { id: 20, name: "Nunu & Willump", roles: ["JUNGLE"] },
    { id: 2, name: "Olaf", roles: ["TOP", "JUNGLE"] },
    { id: 61, name: "Orianna", roles: ["MID"] },
    { id: 516, name: "Ornn", roles: ["TOP"] },
    { id: 80, name: "Pantheon", roles: ["TOP", "MID", "JUNGLE"] },
    { id: 78, name: "Poppy", roles: ["TOP", "JUNGLE"] },
    { id: 555, name: "Pyke", roles: ["SUPPORT"] },
    { id: 497, name: "Rakan", roles: ["SUPPORT"] },
    { id: 33, name: "Rammus", roles: ["JUNGLE"] },
    { id: 58, name: "Renekton", roles: ["TOP"] },
    { id: 526, name: "Rell", roles: ["SUPPORT"] },
    { id: 107, name: "Rengar", roles: ["JUNGLE"] },
    { id: 92, name: "Riven", roles: ["TOP", "JUNGLE"] },
    { id: 68, name: "Rumble", roles: ["TOP"] },
    { id: 13, name: "Ryze", roles: ["MID"] },
    { id: 360, name: "Samira", roles: ["ADC"] },
    //{ id: 113, name: "Sejuani", roles: ["JUNGLE"] },
    { id: 235, name: "Senna", roles: ["SUPPORT", "ADC"] },
    { id: 147, name: "Seraphine", roles: ["SUPPORT", "MID"] },
    { id: 875, name: "Sett", roles: ["TOP"] },
    //{ id: 35, name: "Shaco", roles: ["JUNGLE"] },
    { id: 98, name: "Shen", roles: ["TOP", "JUNGLE"] },
    { id: 102, name: "Shyvana", roles: ["JUNGLE"] },
    { id: 27, name: "Singed", roles: ["TOP"] },
    { id: 14, name: "Sion", roles: ["TOP", "JUNGLE"] },
    { id: 15, name: "Sivir", roles: ["ADC"] },
    //{ id: 72, name: "Skarner", roles: ["JUNGLE"] },
    { id: 37, name: "Sona", roles: ["SUPPORT"] },
    { id: 16, name: "Soraka", roles: ["SUPPORT"] },
    { id: 50, name: "Swain", roles: ["MID", "SUPPORT"] },
    //{ id: 517, name: "Sylas", roles: ["MID"] },
    { id: 134, name: "Syndra", roles: ["MID"] },
    //{ id: 223, name: "Tahm Kench", roles: ["SUPPORT"] },
    { id: 91, name: "Talon", roles: ["MID", "JUNGLE"] },
    //{ id: 44, name: "Taric", roles: ["SUPPORT"] },
    { id: 17, name: "Teemo", roles: ["TOP", "MID"] },
    { id: 412, name: "Thresh", roles: ["SUPPORT"] },
    { id: 18, name: "Tristana", roles: ["ADC"] },
    //{ id: 48, name: "Trundle", roles: ["TOP", "JUNGLE"] },
    { id: 23, name: "Tryndamere", roles: ["TOP", "JUNGLE"] },
    { id: 4, name: "Twisted Fate", roles: ["MID"] },
    { id: 29, name: "Twitch", roles: ["ADC", "JUNGLE"] },
    { id: 6, name: "Urgot", roles: ["MID", "TOP"] },
    { id: 110, name: "Varus", roles: ["ADC"] },
    { id: 67, name: "Vayne", roles: ["ADC"] },
    { id: 45, name: "Veigar", roles: ["MID", "SUPPORT"] },
    { id: 161, name: "Vel'Koz", roles: ["MID", "SUPPORT"] },
    { id: 711, name: "Vex", roles: ["MID"] },
    { id: 254, name: "Vi", roles: ["JUNGLE"] },
    { id: 234, name: "Viego", roles: ["TOP", "JUNGLE"] },
    { id: 112, name: "Viktor", roles: ["MID"] },
    { id: 8, name: "Vladimir", roles: ["MID", "TOP"] },
    { id: 106, name: "Volibear", roles: ["TOP", "JUNGLE"] },
    { id: 19, name: "Warwick", roles: ["TOP", "JUNGLE"] },
    { id: 62, name: "Wukong", roles: ["TOP", "JUNGLE"] },
    { id: 498, name: "Xayah", roles: ["ADC"] },
    //{ id: 101, name: "Xerath", roles: ["MID"] },
    { id: 5, name: "Xin Zhao", roles: ["JUNGLE"] },
    { id: 157, name: "Yasuo", roles: ["MID", "TOP"] },
    { id: 777, name: "Yone", roles: ["MID", "TOP"] },
    //{ id: 83, name: "Yorick", roles: ["TOP"] },
    { id: 350, name: "Yuumi", roles: ["SUPPORT"] },
    //{ id: 154, name: "Zac", roles: ["JUNGLE"] },
    { id: 238, name: "Zed", roles: ["MID", "TOP", "JUNGLE"] },
    { id: 221, name: "Zeri", roles: ["ADC"] },
    { id: 115, name: "Ziggs", roles: ["MID"] },
    { id: 26, name: "Zilean", roles: ["SUPPORT"] },
    { id: 142, name: "Zoe", roles: ["MID"] },
    { id: 143, name: "Zyra", roles: ["SUPPORT", "MID"] },
  ];

  const champions = championBaseList.map((champ) => ({
    ...champ,
  // Use special override if we have it, otherwise fall back to champ.id
    cdragonId: champ.id ?? -1,//championIconIds[champ.name] ?? champ.id,
  }));

  const buildDefaultMatchups = () =>
    champions.reduce((acc, champ) => {
      const counters = champions
        .filter((c) => c.id !== champ.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          baseScore: 0,
          cdragonId: c.cdragonId,
        }));

      return { ...acc, [champ.id]: counters };
    }, {});

  const getChampionIcon = (champion) => {
    const cdragonId = champion?.cdragonId ?? -1;
    return `${COMMUNITY_DRAGON_BASE}/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${cdragonId}.png`;
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
  const matchupData = buildDefaultMatchups();

  // Placeholder previous patch data – can be the same or slightly different
  const previousMatchupData = buildDefaultMatchups();

  const filteredChampions = champions.filter((champ) => {
    const matchesLane =
      selectedLane === "ALL" || champ.roles?.includes(selectedLane);
    if (!matchesLane) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const searchStrings = getChampionSearchStrings(champ.name, selectedLang);
    return searchStrings.some((s) => s.includes(term));
  });

  const makeVoteKey = (relationType, champId, opponentId) =>
    `${relationType}:${champId}-${opponentId}`;

  const getVotePair = (relationType, champId, opponentId) => {
    const key = makeVoteKey(relationType, champId, opponentId);
    return voteTotals[key] || { up: 0, down: 0 };
  };

  const persistVoteTotals = async (
    relationType,
    champId,
    opponentId,
    updated
  ) => {
    const scoreDiff = updated.up - updated.down;

    const { error } = await supabase
      .from("votes")
      .upsert(
        {
          champion_id: champId,
          opponent_id: opponentId,
          relation_type: relationType,
          up_votes: updated.up,
          down_votes: updated.down,
          score_diff: scoreDiff,
        },
        { onConflict: "champion_id,opponent_id,relation_type" }
      );

    if (error) {
      console.error(
        "Supabase upsert votes failed",
        {
          relationType,
          champId,
          opponentId,
          updatedTotals: updated,
        },
        error.message
      );
    }
  };

  const updateVote = (relationType, champId, opponentId, direction) => {
    setVoteTotals((prev) => {
      const key = makeVoteKey(relationType, champId, opponentId);
      const current = prev[key] || { up: 0, down: 0 };

      const updated =
        direction === "up"
          ? { up: current.up + 1, down: current.down }
          : { up: current.up, down: current.down + 1 };

      persistVoteTotals(relationType, champId, opponentId, updated);

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  const handleVote = (champId, counterId, direction) => {
    updateVote("counter", champId, counterId, direction);
  };

  const getCountersForChampion = (champ) => {
    if (!champ) return [];
    const list = matchupData[champ.id] || [];
  
    return [...list]
      .map((item) => {
        const v = getVotePair("counter", champ.id, item.id);
        const diff = v.up - v.down;

        return {
          ...item,
          upVotes: v.up,
          downVotes: v.down,
          score: item.baseScore + diff,
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const handleSynergyVote = (champId, allyId, direction) => {
    updateVote("synergy", champId, allyId, direction);
  };

  const getSynergiesForChampion = (champ) => {
    if (!champ) return [];
    const list = matchupData[champ.id] || [];

    return [...list]
      .map((item) => {
        const v = getVotePair("synergy", champ.id, item.id);
        const diff = v.up - v.down;

        return {
          ...item,
          upVotes: v.up,
          downVotes: v.down,
          score: item.baseScore + diff,
        };
      })
      .sort((a, b) => b.score - a.score);
  };

  const getPreviousCountersForChampion = (champ) => {
    if (!champ) return [];
    const list = previousMatchupData[champ.id] || [];
    return [...list]
      .map((item) => ({
        ...item,
        upVotes: 0,
        downVotes: 0,
      }))
      .sort((a, b) => b.baseScore - a.baseScore);
  };

  const applyReverse = (list) => (isReversed ? [...list].reverse() : list);
  const getDisplayRank = (index, listLength) =>
    isReversed ? listLength - index : index + 1;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const renderVoteControls = (
    relationType,
    champId,
    opponentId,
    upVotes,
    downVotes,
    onUpVote,
    onDownVote
  ) => {
    const key = makeVoteKey(relationType, champId, opponentId);
    const isEditing = editingVoteKey === key;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={editUp}
              onChange={(e) => setEditUp(e.target.value)}
              className={`w-14 px-2 py-1 rounded-md border text-xs ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-900 text-slate-100"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            />
            <input
              type="number"
              min="0"
              value={editDown}
              onChange={(e) => setEditDown(e.target.value)}
              className={`w-14 px-2 py-1 rounded-md border text-xs ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-900 text-slate-100"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => saveVoteEdit(relationType, champId, opponentId)}
              className={`text-[11px] px-2 py-1 rounded-md border hover:bg-emerald-400/10 ${
                theme === "dark"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-emerald-500 text-emerald-600"
              }`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelVoteEdit}
              className={`text-[11px] px-2 py-1 rounded-md border hover:border-slate-500 ${
                theme === "dark"
                  ? "border-slate-700 text-slate-300"
                  : "border-slate-300 text-slate-700"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
            +{upVotes}
          </span>
          <span className="text-xs font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]">
            -{downVotes}
          </span>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => startVoteEdit(relationType, champId, opponentId)}
            className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-600 text-[10px] hover:border-sky-500 hover:bg-slate-900/80"
          >
            ✎
          </button>
        )}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onUpVote}
            className="h-5 w-6 flex items-center justify-center rounded-md border border-slate-700 text-[10px] hover:border-sky-500 hover:bg-slate-900/80"
          >
            ▲
          </button>
          <button
            onClick={onDownVote}
            className="h-5 w-6 flex items-center justify-center rounded-md border border-slate-700 text-[10px] hover:border-sky-500 hover:bg-slate-900/80"
          >
            ▼
          </button>
        </div>
      </div>
    );
  };

  const startVoteEdit = (relationType, champId, opponentId) => {
    const current = getVotePair(relationType, champId, opponentId);
    const key = makeVoteKey(relationType, champId, opponentId);
    setEditingVoteKey(key);
    setEditUp(String(current.up ?? 0));
    setEditDown(String(current.down ?? 0));
  };

  const saveVoteEdit = async (relationType, champId, opponentId) => {
    const key = makeVoteKey(relationType, champId, opponentId);
    const upParsed = parseInt(editUp, 10);
    const downParsed = parseInt(editDown, 10);
    const up = Math.max(0, Number.isFinite(upParsed) ? upParsed : 0);
    const down = Math.max(0, Number.isFinite(downParsed) ? downParsed : 0);

    setVoteTotals((prev) => ({
      ...prev,
      [key]: { up, down },
    }));

    await persistVoteTotals(relationType, champId, opponentId, { up, down });
    setEditingVoteKey(null);
  };

  const cancelVoteEdit = () => {
    setEditingVoteKey(null);
  };

  async function handleAdminLogin(e) {
    e.preventDefault();
    setAuthError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setUser(data.user);
    setAuthPassword("");
    setShowAuthModal(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function savePatchLabel() {
    const value = patchInput || "v6.3e";
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "current_patch",
          setting_value: value,
        },
        { onConflict: "setting_key" }
      );

    if (error) {
      console.warn("Supabase app_settings upsert error", error.message);
      return;
    }

    setPatchLabel(value);
    setIsEditingPatch(false);
  }

  // --- Layouts ---

  const renderTopBar = () => (
    <>
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        {/* App title + patch */}
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold tracking-tight">
            {t.appTitle}
          </div>
          <div className="flex items-center gap-1">
            {isEditingPatch ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={patchInput}
                  onChange={(e) => setPatchInput(e.target.value)}
                  className={`text-[11px] sm:text-xs px-2 py-1 rounded-lg border ${
                    theme === "dark"
                      ? "border-amber-400 bg-slate-900 text-amber-200"
                      : "border-amber-300 bg-white text-amber-700"
                  }`}
                />
              <button
                type="button"
                onClick={savePatchLabel}
                className={`text-[11px] sm:text-xs px-2 py-1 rounded-md border hover:bg-amber-400/10 ${
                  theme === "dark"
                    ? "border-amber-400 text-amber-200"
                    : "border-amber-300 text-amber-700"
                }`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setPatchInput(patchLabel);
                  setIsEditingPatch(false);
                }}
                className={`text-[11px] sm:text-xs px-2 py-1 rounded-md border hover:border-slate-500 ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-300"
                    : "border-slate-300 text-slate-700"
                }`}
              >
                Cancel
              </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div
                  className="text-[11px] sm:text-xs font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                >
                  {patchLabel}
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setPatchInput(patchLabel);
                      setIsEditingPatch(true);
                    }}
                    className={`text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md border hover:bg-amber-400/10 ${
                      theme === "dark"
                        ? "border-amber-300 text-amber-200"
                        : "border-amber-300 text-amber-700"
                    }`}
                  >
                    ✎
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Language selector + theme toggle */}
        <div className="flex flex-col items-end gap-2 w-full max-w-xl">
          <div className="flex flex-col items-end gap-1 w-full">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className={`border rounded-xl px-3 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
                ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleTheme}
              className={`text-[11px] sm:text-xs px-2 py-1 rounded-lg border transition
                ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-300 hover:border-sky-500 hover:text-sky-400"
                    : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-600"
                }`}
            >
              {theme === "dark" ? "🌙" : "✴︎"}
            </button>
          </div>

          {!user ? (
            <div className="flex flex-col items-end gap-1 text-[11px] sm:text-xs w-full">
              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setShowAuthModal(true);
                }}
                className={`px-3 py-1 rounded-lg border font-semibold transition text-[11px] sm:text-xs
                  ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                      : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                  }`}
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1 text-[11px] sm:text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={
                    theme === "dark" ? "text-slate-200" : "text-slate-800"
                  }
                >
                  Logged in as {user.email}
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-400 text-slate-900 shadow-sm">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className={`px-3 py-1 rounded-lg border font-semibold transition text-[11px] sm:text-xs
                  ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                      : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                  }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className={`w-full max-w-xs rounded-2xl shadow-2xl border px-5 py-4 flex flex-col gap-3
              ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin / User login</span>
                <span
                  className={
                    theme === "dark" ? "text-slate-400 text-xs" : "text-slate-500 text-xs"
                  }
                >
                  Sign in with your email and password.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className={`text-xs px-2 py-1 rounded-md border transition self-start
                  ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-300"
                      : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                  }`}
              >
                ✕
              </button>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handleAdminLogin}>
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
                  ${
                    theme === "dark"
                      ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
              />
              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500
                  ${
                    theme === "dark"
                      ? "bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  }`}
              />
              {authError && (
                <div className="text-xs text-red-400">{authError}</div>
              )}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition
                    ${
                      theme === "dark"
                        ? "border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-300"
                        : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition text-sm
                    ${
                      theme === "dark"
                        ? "border-slate-700 text-slate-100 hover:border-sky-500 hover:text-sky-300"
                        : "border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700"
                    }`}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
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
            const iconSrc = getChampionIcon(champ);

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
  
    const countersBase = getCountersForChampion(selectedChampion);
    const previousCountersBase = getPreviousCountersForChampion(selectedChampion);
    const synergiesBase = getSynergiesForChampion(selectedChampion);

    const counters = applyReverse(countersBase);
    const previousCounters = applyReverse(previousCountersBase);
    const synergies = applyReverse(synergiesBase);
  
    const championMainName = getChampionMainName(
      selectedChampion.name,
      selectedLang
    );
    const championDisplayName = getChampionDisplayName(
      selectedChampion.name,
      selectedLang
    );
    const championIcon = getChampionIcon(selectedChampion);
  
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
                {t.countersAndSynergiesLabel}
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
            <div className="font-semibold text-sky-400 mb-1">{patchLabel}</div>
            <button
              type="button"
              onClick={() => setShowPreviousPatch((prev) => !prev)}
              className="underline-offset-2 hover:underline text-sky-400"
            >
              {showPreviousPatch ? t.hidePrev : t.comparePrev}
            </button>
          </div>
        </div>
  
        {/* Counter + synergy list */}
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
            <>
              {/* Column labels (top row) */}
              <div className="flex justify-between items-baseline text-[11px] text-slate-400 mb-1 px-1">
                <div className="flex items-center gap-2">
                  <span>{t.countersLabel}</span>
                  <button
                    type="button"
                    onClick={() => setIsReversed((prev) => !prev)}
                    className={`px-2 py-1 rounded-md border text-[10px] sm:text-[11px] transition ${
                      theme === "dark"
                        ? "border-slate-700 text-slate-400 bg-slate-900 hover:border-slate-500 hover:bg-slate-900/80"
                        : "border-slate-300 text-slate-600 bg-white hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    ↑↓
                  </button>
                </div>
                <span>
                  {showPreviousPatch ? t.previousPatchScore : t.bestSynergyLabel}
                </span>
              </div>
  
              <div className="max-h-[60vh] flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* MODE 1: Counters + Synergy (default) */}
                {!showPreviousPatch && (
                  <>
                    {/* Current counters column */}
                    <div className="sm:flex-1 flex flex-col gap-2 overflow-y-auto pr-1 scroll-column">
                      {counters.map((counter, index) => {
                        const displayRank = getDisplayRank(index, counters.length);
                        const counterMainName = getChampionMainName(
                          counter.name,
                          selectedLang
                        );
                        const counterDisplayName = getChampionDisplayName(
                          counter.name,
                          selectedLang
                        );
                        const counterIcon = getChampionIcon(counter);
  
                        return (
                          <div
                            key={`current-${counter.id}`}
                            className={`flex min-h-[72px] items-center gap-3 rounded-xl px-3 py-2 text-sm border
                              ${theme === "dark"
                                ? "bg-slate-950/60 border-slate-800"
                                : "bg-slate-50 border-slate-200"}
                            `}
                          >
                            {/* Rank number */}
                            <div className="w-6 text-xs text-slate-500 text-right">
                              #{displayRank}
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
  
                            {/* Vote totals + vote buttons */}
                            {renderVoteControls(
                              "counter",
                              selectedChampion.id,
                              counter.id,
                              counter.upVotes,
                              counter.downVotes,
                              () => handleVote(selectedChampion.id, counter.id, "up"),
                              () => handleVote(selectedChampion.id, counter.id, "down")
                            )}
                          </div>
                        );
                      })}
                    </div>
  
                    {/* Synergy column */}
                    <div className="sm:flex-1 flex flex-col gap-2 overflow-y-auto pl-1 scroll-column">
                      {synergies.map((ally, index) => {
                        const displayRank = getDisplayRank(index, synergies.length);
                        const allyMainName = getChampionMainName(
                          ally.name,
                          selectedLang
                        );
                        const allyDisplayName = getChampionDisplayName(
                          ally.name,
                          selectedLang
                        );
                        const allyIcon = getChampionIcon(ally);
  
                        return (
                          <div
                            key={`synergy-${ally.id}`}
                            className={`flex min-h-[72px] items-center gap-3 rounded-xl px-3 py-2 text-sm border
                              ${theme === "dark"
                                ? "bg-slate-950/60 border-slate-800"
                                : "bg-slate-50 border-slate-200"}
                            `}
                          >
                            {/* Rank number */}
                            <div className="w-6 text-xs text-slate-500 text-right">
                              #{displayRank}
                            </div>
  
                            {/* Icon + name */}
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                className={`h-8 w-8 rounded-xl border overflow-hidden flex items-center justify-center text-[11px] font-semibold
                                  ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-300"}
                                `}
                              >
                                {allyIcon ? (
                                  <img
                                    src={allyIcon}
                                    alt={allyDisplayName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span>{allyMainName[0]}</span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={`font-medium text-xs sm:text-sm ${
                                    theme === "dark" ? "text-slate-50" : "text-slate-900"
                                  }`}
                                >
                                  {allyDisplayName}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {t.communityScore}
                                </span>
                              </div>
                            </div>
  
                            {/* Vote totals + vote buttons */}
                            {renderVoteControls(
                              "synergy",
                              selectedChampion.id,
                              ally.id,
                              ally.upVotes,
                              ally.downVotes,
                              () =>
                                handleSynergyVote(selectedChampion.id, ally.id, "up"),
                              () =>
                                handleSynergyVote(selectedChampion.id, ally.id, "down")
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
  
                {/* MODE 2: Compare with previous patch (current counters + previous counters) */}
                {showPreviousPatch && (
                  <>
                    {/* Current patch column (same as before) */}
                    <div className="sm:flex-1 flex flex-col gap-2 overflow-y-auto pr-1 scroll-column">
                      {counters.map((counter, index) => {
                        const displayRank = getDisplayRank(index, counters.length);
                        const counterMainName = getChampionMainName(
                          counter.name,
                          selectedLang
                        );
                        const counterDisplayName = getChampionDisplayName(
                          counter.name,
                          selectedLang
                        );
                        const counterIcon = getChampionIcon(counter);
  
                        return (
                          <div
                            key={`current-${counter.id}`}
                            className={`flex min-h-[72px] items-center gap-3 rounded-xl px-3 py-2 text-sm border
                              ${theme === "dark"
                                ? "bg-slate-950/60 border-slate-800"
                                : "bg-slate-50 border-slate-200"}
                            `}
                          >
                            {/* Rank number */}
                            <div className="w-6 text-xs text-slate-500 text-right">
                              #{displayRank}
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
  
                            {/* Vote totals + vote buttons */}
                            {renderVoteControls(
                              "counter",
                              selectedChampion.id,
                              counter.id,
                              counter.upVotes,
                              counter.downVotes,
                              () => handleVote(selectedChampion.id, counter.id, "up"),
                              () => handleVote(selectedChampion.id, counter.id, "down")
                            )}
                          </div>
                        );
                      })}
                    </div>
  
                    {/* Previous patch column (read-only) */}
                    <div className="sm:flex-1 flex flex-col gap-2 overflow-y-auto pl-1 scroll-column">
                      {previousCounters.length === 0 ? (
                        <div className="text-sm text-slate-400 text-center py-6">
                          {t.noPreviousPatchData}
                        </div>
                      ) : (
                        previousCounters.map((counter, index) => {
                          const displayRank = getDisplayRank(
                            index,
                            previousCounters.length
                          );
                          const counterMainName = getChampionMainName(
                            counter.name,
                            selectedLang
                          );
                          const counterDisplayName = getChampionDisplayName(
                            counter.name,
                            selectedLang
                          );
                          const counterIcon = getChampionIcon(counter);
  
                          return (
                            <div
                              key={`previous-${counter.id}`}
                              className={`flex min-h-[72px] items-center gap-3 rounded-xl px-3 py-2 text-sm border opacity-80
                                ${theme === "dark"
                                  ? "bg-slate-950/40 border-slate-800"
                                  : "bg-slate-50 border-slate-200"}
                              `}
                            >
                              {/* Rank number */}
                              <div className="w-6 text-xs text-slate-500 text-right">
                                #{displayRank}
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
  
                              {/* Vote totals (no voting buttons) */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]">
                                  +{counter.upVotes}
                                </span>
                                <span className="text-xs font-semibold text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]">
                                  -{counter.downVotes}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark"
        ? "bg-slate-950 text-slate-100 app-dark"
        : "bg-slate-50 text-slate-900 app-light"
      }`}
    >
      {renderTopBar()}
      {selectedChampion ? renderChampionCounters() : renderHome()}
    </div>
  );
}
