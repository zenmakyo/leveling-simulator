function updateOptions() {
  const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
  const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;
  console.log(selected1, selected2); // ←確認用
}
  
document.addEventListener("DOMContentLoaded", () => {
  const abilityRadios1 = document.querySelectorAll('input[name="ability1"]');
  const abilityRadios2 = document.querySelectorAll('input[name="ability2"]');
  const enhanceBox = document.getElementById("enhanceBox");
  const slotBox = document.getElementById("slotBox");

  function updateOptions() {
    // 現在の選択値を取得
    const selected1 = document.querySelector('input[name="ability1"]:checked')?.value;
    const selected2 = document.querySelector('input[name="ability2"]:checked')?.value;

    // 強化値は「博識 or 共栄」のどちらかが含まれていたら表示
    if (selected1 === "博識" || selected2 === "博識" || selected1 === "共栄" || selected2 === "共栄") {
      enhanceBox.style.display = "flex";
    } else {
      enhanceBox.style.display = "none";
    }

    // 参加枠数は「共栄」が含まれていたら表示
    if (selected1 === "共栄" || selected2 === "共栄") {
      slotBox.style.display = "flex";
    } else {
      slotBox.style.display = "none";
    }
  }

  // 初期チェック
  updateOptions();

  // 変更イベントを監視
  abilityRadios1.forEach(radio => radio.addEventListener("change", updateOptions));
  abilityRadios2.forEach(radio => radio.addEventListener("change", updateOptions));
});

const targetInput = document.querySelector(".targetInput");
const suggestionBox = document.querySelector(".targetSuggestions");

const targetExpTable = {
  "闇黒龍": 497,
  "叛逆の断罪者": 326,
  "盲鬼ト浮鬼": 275
  
};

function updateSuggestions() {
  const value = targetInput.value.trim();
  suggestionBox.innerHTML = ""; // 既存候補クリア

  if (!value) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = enemies.filter(e => e.includes(value));

  if (matches.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  matches.forEach(match => {
    const div = document.createElement("div");
    div.textContent = match;
    div.style.padding = "5px";
    div.style.cursor = "pointer";

    div.addEventListener("mousedown", () => { // clickよりmousedownの方が安全
      targetInput.value = match;
      suggestionBox.style.display = "none";
    });

    suggestionBox.appendChild(div);
  });

  suggestionBox.style.display = "block";
}

// 入力中に候補を更新
targetInput.addEventListener("input", updateSuggestions);

// フォーカスが外れたら非表示（クリックで選択できるよう少し遅延）
targetInput.addEventListener("blur", () => {
  setTimeout(() => {
    suggestionBox.style.display = "none";
  }, 100);
});

// フォーカス時にも候補を更新
targetInput.addEventListener("focus", updateSuggestions);
