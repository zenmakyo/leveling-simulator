<script>
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
</script>
