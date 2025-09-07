document.addEventListener("DOMContentLoaded", () => {

  /* レベル入力 */
  document.querySelectorAll(".adjustBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input[type=number]");
      let value = parseInt(input.value) || 0;
      value += parseInt(btn.dataset.value);
      if (value < 1) value = 1;
      if (value > 250) value = 250;
      input.value = value;
    });
  });

  // 半角数字のみ許可
  function enforceHalfWidthDigits(input) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
  }

  const currentLevel = document.getElementById("currentLevel");
  const targetLevel = document.getElementById("targetLevel");
  const nextExp = document.getElementById("nextExp");
  [currentLevel, targetLevel, nextExp].forEach(enforceHalfWidthDigits);

  /* 転生数に色付け */
  const rebirth = document.getElementById("rebirth");
  const rebirthColors = {
    "0": "rgba(220, 221, 221, 0.5)",
    "1": "rgba(187, 200, 230, 0.5)",
    "2": "rgba(44, 169, 225, 0.5)",
    "3": "rgba(102, 255, 102, 0.5)",
    "4": "rgba(255, 255, 0, 0.5)",
    "5": "rgba(255, 204, 0, 0.5)",
    "6": "rgba(255, 153, 0, 0.5)",
    "7": "rgba(204, 0, 0, 0.5)",
    "8": "rgba(255, 51, 204, 0.5)",
    "9": "rgba(153, 0, 204, 0.5)"
  };
  rebirth.addEventListener("change", () => {
    rebirth.style.backgroundColor = rebirthColors[rebirth.value] || "#fff";
  });

  /* 討伐対象のみリセット */
document.getElementById("resetTargetBtn").addEventListener("click", () => {
  targetInput.value = "";                   // 入力を空に
  suggestionsBox.style.display = "none";   // 候補を非表示
  document.getElementById("customExpBox").style.display = "none"; // カスタム経験値欄も非表示
});

  /* 強化値・参加枠数表示 */
  const abilityRadios1 = document.querySelectorAll('input[name="ability1"]');
  const abilityRadios2 = document.querySelectorAll('input[name="ability2"]');
  const enhanceBox = document.getElementById("enhanceBox");
  const slotBox = document.getElementById("slotBox");

  function updateOptions() {
    const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
    const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;
    enhanceBox.style.display = (selected1 === "博識" || selected2 === "博識" || selected1 === "共栄" || selected2 === "共栄") ? "flex" : "none";
    slotBox.style.display = (selected1 === "共栄" || selected2 === "共栄") ? "flex" : "none";
  }

  updateOptions();
  abilityRadios1.forEach(r => r.addEventListener("change", updateOptions));
  abilityRadios2.forEach(r => r.addEventListener("change", updateOptions));

  /* 討伐対象候補 */
  const targetExpTable = {
    "[497] 闇黒龍": 497, "[326] 叛逆の断罪者": 326, "[275] 盲鬼ト浮鬼": 275, "[261] 砂漠の亡者":261, "[250] 終焉の指揮者": 250, "[222] ポセイドン": 222, "[196] 死を告げる者": 196, "[183] 疎まれし者": 183, "[169] 刑罰を記すもの": 169, "[161] ロックイーター": 161,
    "[147] カトブレパス": 147, "[134] 海太郎": 134, "[122] 意思ある肖像": 122, "[106] ウッビィ": 106, "[94] スキュラ": 94, "[78] 鼠小組": 78, "[59] 画匠カミーリオ": 59, "[43] 川太郎": 43, "[29] 魔女の森の梟": 29, "[20] お化け提灯": 20,
    "[7] トゲウサギ": 7, "[5] コブンネズミ": 5,
    "[5] 宝食のミミクル": 5, "[200] グリフォン": 200, "[200] フリームスルス": 200, "[200] ジャッカロープ": 200,
    "[4500] 星詠の天極主（星譚♪星御伽に夢心地）": 4500, "[4444] 狐...？（遊曲♪朱狐と祭囃子）": 4444, "[3333] 急の試練・狐（急の試練）": 3333, "[3000] シルバー・G・ゴーレム（魔導体G.Q/ヒーローバッジ）": 3000, "[2500] ゲンペイボタル（曲名♪あの日見た五光）": 2500,
    "[2500] 玉藻御前（醒曲♪絶世の美狐）": 2500, "[2500] ダークロードノヴァ（醒曲♪騎士道邪心）": 2500, "[2500] 熾天什使（醒曲♪輝く碧き六翼）": 2500, "[2500] 月都之常姫（醒曲♪今は遠き郷月）": 2500, "[2500] ルシファー【覚醒】（醒曲♪堕ちたる明星）": 2500,
    "[2500] 天使長ルシファー（醒曲♪明星の行く末は）": 2500, "[2500] ジャンヌダルク【覚醒】（醒曲♪先導せし聖女）": 2500, "[2500] ジャンヌダルク・イフ（醒曲♪煽動せし魔女）": 2500, "[2500] 鎮守オータムドラゴン（醒曲♪秋季に揺らす恵傘）": 2500, "[2500] 黒麒麟・華天（醒曲♪生起する嘶き）": 2500,
    "[2000] 一反木綿（空飛ぶ白布...？）": 2000, "[1500] 揺蕩う白影（双眼鏡）": 1500, "[1050] 有頂天狐（経験値）（もっちり揚げ袋）": 1050,
    "[800] 夢幻の胡蝶【悪夢】（栩栩然の香）": 800, "[777] おみくじ小町【大吉】（鳥御籤）": 777, "[777] 招福宝船（曲名♪七福宝船）": 777, "[766] ティアマト（壊曲♪壮麗たる巨翼）": 766, "[766] 創造神（曲名♪世界の再生/ヒーローバッジ）": 766, "[750] 黒禍フェンリル（壊曲♪巨狼の激昂）": 750,
    "[735] 強烈な脚技使い（ゴング）": 735, "[735] フェンリル（壊曲♪巨狼の蹂躙）": 735, "[735] バハムート（極星の熱量）": 735, "[735] オキクルミ（曲名♪英雄凍土）": 735, "[735] 焦恋の清姫（曲名♪恋焦ガレ）": 735, "[735] 傾国の妖狐・妲己（曲名♪酒池肉林）": 735,
    "[704] 伊邪那（八百万神集絵巻）": 704, "[704] スセリヒメ（八百万神集絵巻）": 704, "[704] 高闇之淤加美神（八百万神集絵巻）": 704, "[704] アメノウズメ（八百万神集絵巻）": 704, "[704] 天叢雲剣・天羽々斬（八百万神集絵巻）": 704, "[704] 東雲之富慈神（八百万神集絵巻）": 704, "[704] 八坂瓊曲玉（八百万神集絵巻）": 704,
    "[704] 真経津鏡（八百万神集絵巻）": 704, "[704] 大口真神（八百万神集絵巻）": 704, "[704] 天津甕星（八百万神集絵巻）": 704, "[704] 緋翼のアグシャナ（曲名♪幽閉の緋帝）": 704, "[704] ベヒモス（壊曲♪最果ての断崖）": 704, "[704] 百花仙子（曲名♪華やぐ仙女）": 704,
    "[700] ガブリエルを救おう！（天礼水）": 700, "[700] アルタ・テオリカル（幻獣乱舞の儀）": 700, "[700] アルタ・ナインハーツ（幻獣乱舞の儀）": 700, "[700] アルタ・ニ・コヴァン（幻獣乱舞の儀）": 700,
    "[689] 戦嵐ノ影獅子（憤怒ノ鏡）": 689, "[689] ルシファー【真夏】（ONSTAGE！）": 689, "[689] ニーズヘッグ（曲名♪禍根の胎動）": 689,
    "[674] 竜契皇ウィルヘミナ（シャルウィダンス？）": 674, "[674] 乙姫（曲名♪波間仰ぐ姫君）": 674, "[674] 霹靂之狼王（曲名♪稲妻を統べる王）": 674, "[674] 赫轟魔イフリート（曲名♪殲滅業火）": 674, "[674] 南国の女神ペレ（曲名♪燃ゆる島の女神）": 674,
    "[661] レクス・レヴナント（時代の帰還）": 661, "[661] 揺蕩う白影（双眼鏡）": 661, "[661] 一反木綿（空飛ぶ白布...？）": 661, "[661] 歴戦の格闘王（ゴング）": 661,
    "[643] 影獅子（曲名♪闇ノ戦神）": 643, "[643] 座天使（曲名♪見定める翼）": 643, "[643] 月日を追う者（曲名♪日月ヲ喰ム）": 643, "[643] 竜吉公主（曲名♪青鸞闘闕にて）": 643, "[643] フランケンシュタイン（曲名♪マッド・フィート）": 643, "[643] 霊峯之大主（曲名♪地恩の息吹）": 643,
    "[621] 黒魔女レイちゃん（壊曲♪猫の気まぐれ）": 621, "[613] 美術商ジェーン・ドゥ（シャルウィダンス？）": 613, "[613] 黒陸吾（曲名♪明媚な庭にて）": 613, "[613] フレイヤ（曲名♪愛が導くままに）": 613, "[613] 斉天大聖（曲名♪筋斗雲に乗って）": 613, "[609] スカサハ（曲名♪不滅なる影の国）": 609, "[608] エレクトラ（曲名♪慈愛の形）": 608,
    "[595] 揺蕩う白影（双眼鏡）": 595, "[595] 戦神と称される獅子（ゴング）": 595, "[595] ロキ（曲名♪ボクはロキ）": 595, "[595] ロキ【肝試】（曲名♪怨霊パレヱド）": 595,
    "[588] ヴァイシュラヴァナ（曲名♪邪滅の三叉槍）": 588, "[582] 玉姫（曲名♪淡鶯流舞）": 582, "[582] 竜扇陽（曲名♪屠竜之技）": 582, "[582] ベリアル（曲名♪恍惚の礼讃歌）": 582, "[582] タケミカヅチ（曲名♪武雷裂電）": 582,
    "[581] 残虐と噂の出場者（ゴング）": 581, "[581] 時の腐肉喰らい（曲名♪逃れられぬ牙/エイボンの書）": 581, "[581] 千の仔を随えし黒山羊（曲名♪黒き豊穣の女神/エイボンの書）": 581, "[581] 幻月に蔓延りし者（曲名♪未知なる幻夢境）": 581, "[581] 這い寄る混沌（幻獣乱舞の儀）": 581,
    "[581] 渾沌（金印）": 581, "[581] 饕餮（金印）": 581, "[581] 窮奇（金印）": 581, "[581] 難訓（金印）": 581, "[581] 阿（五鈷鈴）": 581, "[581] 吽（五鈷鈴）": 581,
    "[581] メデューサ（ネクタル）": 581, "[581] エウリュアレ（ネクタル）": 581, "[581] ステンノ（ネクタル）": 581, "[581] 壊星神コスモ（幼き原星）": 581, "[581] 創星神コスモ（幼き原星）": 581, "[581] 破壊神（壊曲♪崩落の音）": 581, "[581] 霧邪奇（曲名♪悪意なき邪悪）": 581,
    "[568] エーヌシトルイユ（曲名♪遅れた執着点）": 568, "[567] 羅刹鬼（曲名♪戦刃羅刹）": 567, "[560] アスモデウス（曲名♪悦楽の吐息）": 560,
    "[555] 急の試練・玉藻御前（急の試練）": 555, "[555] 闇に囁く者（曲名♪ユゴスの採掘者/エイボンの書）": 555, "[555] 名状しがたい者（曲名♪黄衣の王/エイボンの書）": 555, "[555] 緑の深淵の女王（曲名♪底知れぬ緑/エイボンの書）": 555, "[555] 星間を駆ける者（曲名♪後星の石笛/エイボンの書）": 555, "[555] 獄星の千年花（曲名♪一千年の開花/エイボンの書）": 555, "[555] 地を穿つ魔（曲名♪狂気の奉仕者/エイボンの書）": 555,
    "[555] 旧支配者の大祭司（幻獣乱舞の儀/エイボンの書）": 555, "[555] 悪路王（結酒樽）": 555, "[555] 熾天使（曲名♪闇を切裂く翼）": 555, "[555] ダークロードナイトメア（曲名♪邪悪なる騎士）": 555, "[555] 玉藻前（曲名♪眩惑の微笑）": 555, "[555] なまはげ（壊曲♪悪い子探し）": 555, "[555] 真夜中の贈呈者（壊曲♪聖夜を壊す者）": 555,
    "[555] 夢魔（曲名♪覚めない嘘）": 555, "[555] アジダハーカ（曲名♪彼方の渇望）": 555, "[555] アルセーヌ・ルパン（曲名♪摩天楼を舞う影）": 555, "[555] 石川五右衛門（曲名♪天下を騒がす煙）": 555, "[555] 紅藍ノ朋（藍の友情結び）": 555, "[555] 翠霊社の大神主（曲名♪鎮護の翠獣）": 555, "[555] 綾取人形師（曲名♪私が欲しいのは）": 555,
    "[551] 急の試練・春陽之神使（急の試練）": 551, "[551] 急の試練・薄明之妖狐（急の試練）": 551, "[551] イワナガヒメ（シャルウィダンス？）": 551, "[551] 白澤（曲名♪通暁の瞳）": 551, "[551] 禍津（曲名♪禊の祓子）": 551, "[551] 霊騎士シルドラント（曲名♪魂の帰還）": 551,
    "[550] シュクレッタ（曲名♪SweetParty!）": 550, "[546] 反魂竜（曲名♪呼び戻す命）": 546, "[542] 閻魔大女将（曲名♪閻魔庁開廷）": 542,
    "[542] 白妙鹿天（曲名♪訪秋黄穂）": 542, "[542] ルシファー（曲名♪光をもたらす者）": 542, "[542] ジャンヌダルク（曲名♪神が導きし剣）": 542, "[542] スケイプドラゴン（曲名♪明冬の兆し）": 542, "[542] 大海嘯の紅殻竜（曲名♪海裂紅甲）": 542, "[542] コノハナサクヤ（曲名♪舞えや咲かせや）": 542,
    "[536] アナト（曲名♪激情径行）": 536, "[529] 揺蕩う白影（双眼鏡）": 529, "[529] 一反木綿（空飛ぶ白布...？）": 529, "[529] 聖竜（古曲♪聖の喚ぶ声）": 529, "[529] 闇竜（古曲♪闇に轟く咆哮）": 529,
    "[529] アテナ（曲名♪紅の砦陣）": 529, "[529] 荒くれ番長ラウディ（曲名♪喧嘩上等！）": 529, "[529] ガブリエル【闇喰】（曲名♪終末の奏）": 529, "[529] 無頼瓜（曲名♪夏浜の余興）": 529, "[527] 大国主（曲名♪創国への歩み）": 527,
    "[521] アポロンα（曲名♪沈まぬ太陽）": 521, "[521] ヘイムダル（曲名♪虹橋の番人）": 521, "[521] 魔術師マーリン（曲名♪魔術の真髄）": 521, "[521] 金鵄（曲名♪制勝の光芒）": 521,
    "[515] 白兎神（曲名♪良縁月兎）": 515, "[515] 薛茘鬼（曲名♪マジ鬼ごっこ）": 515, "[505] 五十嵐・卍（曲名♪ド派手忍法帖）": 505, "[502] 彩海のシウミゥ（曲名♪ギャル⭐︎MIND）": 502, "[502] 百々目鬼（曲名♪花魁掌中）": 502,
    "[500] メタルゴーレム（魔導体G.Q）": 500, "[500] つちのこ（曲名♪このこなんのこ）": 500, "[500] 幻綴司書アナムネシア（幻獣乱舞の儀）": 500
  };
  const wordList = ["カスタム経験値", ...Object.keys(targetExpTable)];
  const targetInput = document.getElementById("targetInput");
  const suggestionsBox = document.querySelector(".targetSuggestions");

  function updateSuggestions() {
    const value = targetInput.value.trim().toLowerCase();
    const matches = value === "" ? wordList : wordList.filter(w => w.toLowerCase().includes(value));
    suggestionsBox.innerHTML = "";
    if (matches.length > 0) {
      matches.forEach(word => {
        const div = document.createElement("div");
        div.textContent = word;
        div.addEventListener("mousedown", () => {
        targetInput.value = word;
        suggestionsBox.style.display = "none";

  // 「カスタム経験値」選択時のみ表示
  if (word === "カスタム経験値") {
    document.getElementById("customExpBox").style.display = "block";
  } else {
    document.getElementById("customExpBox").style.display = "none";
  }
});
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.style.display = "block";
    } else {
      suggestionsBox.style.display = "none";
    }
  }

  targetInput.addEventListener("input", updateSuggestions);
  targetInput.addEventListener("focus", updateSuggestions);
  targetInput.addEventListener("blur", () => setTimeout(() => { suggestionsBox.style.display = "none"; }, 100));

  /* 総必要経験値計算 */
  function calcTotalExp(currentLv, targetLv, rebirth, nextExp) {
    if (currentLv >= targetLv) return 0;
    let total = nextExp;
    for (let lv = currentLv + 1; lv <= targetLv - 1; lv++) {
      total += lv * (11 + rebirth) - 3;
    }
    return total;
  }

  /* 討伐一回あたりの経験値 */
  function calcExpPerBattle(targetExp, itemMultiplier, ability1, ability2, enhanceValue, slotValue, boostMultiplier) {
    function abilityMultiplier(val) {
      switch(val){
        case "習熟/記念": return 10;
        case "博識": return enhanceValue;
        case "早熟": return 30;
        case "共栄": return Math.floor(enhanceValue * slotValue);
        default: return 0;
      }
    }
    const totalPercent = abilityMultiplier(ability1) + abilityMultiplier(ability2);
    return Math.ceil(targetExp * itemMultiplier * (1 + totalPercent / 100) * boostMultiplier);
  }

  /* ブーストボタンのオンオフ */
  const boostRadios = document.querySelectorAll('input[name="boost"]');

boostRadios.forEach(radio => {
  radio.addEventListener("click", () => {
    if (radio.wasChecked) {
      radio.checked = false; // もう一度押したら解除
    }
    boostRadios.forEach(r => r.wasChecked = r.checked); // 状態を更新
  });
});

  /* 計算・表示 */
  document.getElementById("calcBtn").addEventListener("click", () => {
    const curLv = parseInt(currentLevel.value) || 1;
    const tarLv = parseInt(targetLevel.value) || 1;
    const next = parseInt(nextExp.value) || 0;
    const reb = parseInt(rebirth.value) || 0;
    let targetExp;
      if (targetInput.value === "カスタム経験値") {
        targetExp = parseInt(document.getElementById("customExpInput").value) || 0;
      } else {
        targetExp = targetExpTable[targetInput.value] || 0;
      }
    const itemMultiplier = parseInt(document.querySelector('input[name="item"]:checked')?.value) || 1;
    const ability1 = document.querySelector('input[name="ability1"]:checked')?.value || "none";
    const ability2 = document.querySelector('input[name="ability2"]:checked')?.value || "none";
    const enhanceVal = parseInt(document.getElementById("enhanceValue").value) || 0;
    const slotVal = parseFloat(document.getElementById("slotValue").value) || 1;
    const boostMultiplier = parseFloat(document.querySelector('input[name="boost"]:checked')?.value) || 1;

    const totalExpNeeded = calcTotalExp(curLv, tarLv, reb, next);
    const expPerBattle = calcExpPerBattle(targetExp, itemMultiplier, ability1, ability2, enhanceVal, slotVal, boostMultiplier);

    const numBattles = Math.ceil(totalExpNeeded / expPerBattle);
    const obtainedExp = numBattles * expPerBattle;
    const fraction = obtainedExp - totalExpNeeded;

    const targetLevelNext = tarLv * (11 + reb) - 3;
    const remainingNext = targetLevelNext - fraction;

    // 討伐回数に応じて必要コイン数を計算（1コインで5回討伐可能として切り上げ）
    const totalCoins = Math.ceil(numBattles / 5);

   /* 警告・Next計算 */
const fractionWarning = document.getElementById("fractionWarning");
const resultNext = document.getElementById("resultNext");
let displayLevel = tarLv;
let remainExp = tarLv * (11 + reb) - 3 - fraction; // 目標レベルNext - 端数

if (remainExp >= 0) {
  // --- 通常時 ---
  resultNext.style.display = "block";
  document.getElementById("nextExpDisplay").textContent = remainExp;
  fractionWarning.style.display = "none";
} else {
  // --- 超過時 ---
  resultNext.style.display = "none";

  let overExp = remainExp; // 負の値
  while (overExp < 0) {
    displayLevel++;
    const nextForLevel = displayLevel * (11 + reb) - 3;
    overExp += nextForLevel;
  }

  fractionWarning.style.display = "block";
  fractionWarning.innerHTML = `
    ※ 目標レベルを超えてレベルアップします<br>
    推定Lv ${displayLevel} , Next ${overExp} Exp
  `;
}

    // 結果表示
    document.getElementById("resultBox").style.display = "block";
    document.getElementById("currentLvDisplay").textContent = curLv;
    document.getElementById("targetLvDisplay").textContent = tarLv;
    document.getElementById("numBattlesDisplay").textContent = numBattles;
    document.getElementById("coinDisplay").textContent = totalCoins;
    document.getElementById("result").style.display = "none";
  });

  /* リセットボタン */
  document.getElementById("resetBtn").addEventListener("click", () => {
    currentLevel.value = 1;
    targetLevel.value = 1;
    nextExp.value = 0;
    rebirth.value = 0;
    rebirth.style.backgroundColor = rebirthColors["0"];

    // アイテムは「章なし」を選択
    document.querySelectorAll('input[name="item"]').forEach(r => r.checked = r.value === "1");

    // アビリティは「なしなし」を選択
    document.querySelectorAll('input[name="ability1"]').forEach(r => r.checked = r.value === "none");
    document.querySelectorAll('input[name="ability2"]').forEach(r => r.checked = r.value === "none");

    // 強化値・参加枠数初期値
    document.getElementById("enhanceValue").value = 20;
    document.getElementById("slotValue").value = "2.5"; // 4枠と一致させる

    // ブースト解除
    document.querySelectorAll('input[name="boost"]').forEach(r => r.checked = false);

    // 討伐対象の入力欄をクリア
    targetInput.value = "";
    
    // 計算結果非表示
    document.getElementById("resultBox").style.display = "none";
    fractionWarning.style.display = "none";
    document.getElementById("result").style.display = "block"; // リセット時に再表示
    document.getElementById("result").textContent = "ここに結果が表示されます";

    updateOptions(); // アビリティ選択後の表示更新
  });

});
