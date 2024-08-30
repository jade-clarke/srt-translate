const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

async function main() {
  const kuroshiro = new Kuroshiro();

  kuroshiro
    .init(new KuromojiAnalyzer())
    .then(function () {
      return kuroshiro.convert("複雑な概念", { to: "hiragana" });
    })
    .then(function (result) {
      console.log(result);
      //shingeki no kyojin
    });
}

main();
