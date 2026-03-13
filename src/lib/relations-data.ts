// 人物相関図データ定義

export interface RelationCharacter {
  id: string; // 作品内ユニークID（例: "char1"）
  name: string; // キャラクター名
  actorName: string; // 俳優名（TMDbキャストとのマッチングに使用）
  x: number; // 0-100 正規化X座標
  y: number; // 0-100 正規化Y座標
  isProtagonist?: boolean;
}

export type RelationType = "family" | "love" | "rival" | "ally" | "mentor" | "neutral";

export interface Relationship {
  from: string; // character id
  to: string; // character id
  label: string;
  type: RelationType;
}

export interface MovieRelationData {
  movieId: number;
  mediaType: "movie" | "tv";
  title: string;
  characters: RelationCharacter[];
  relationships: Relationship[];
}

export const RELATION_TYPE_META: Record<RelationType, { color: string; label: string }> = {
  family: { color: "#f59e0b", label: "家族" },
  love: { color: "#f43f5e", label: "恋愛" },
  rival: { color: "#ef4444", label: "敵対" },
  ally: { color: "#3b82f6", label: "味方" },
  mentor: { color: "#10b981", label: "師弟" },
  neutral: { color: "#6b7280", label: "その他" },
};

const ALL_RELATIONS: MovieRelationData[] = [
  // ターミネーター2 (280)
  {
    movieId: 280,
    mediaType: "movie",
    title: "ターミネーター2",
    characters: [
      { id: "t800", name: "T-800", actorName: "アーノルド・シュワルツェネッガー", x: 50, y: 15, isProtagonist: true },
      { id: "sarah", name: "サラ・コナー", actorName: "リンダ・ハミルトン", x: 15, y: 45 },
      { id: "john", name: "ジョン・コナー", actorName: "Edward Furlong", x: 50, y: 55 },
      { id: "t1000", name: "T-1000", actorName: "ロバート・パトリック", x: 85, y: 45 },
      { id: "dyson", name: "マイルズ・ダイソン", actorName: "Joe Morton", x: 25, y: 85 },
    ],
    relationships: [
      { from: "t800", to: "john", label: "守護者", type: "ally" },
      { from: "sarah", to: "john", label: "母子", type: "family" },
      { from: "t1000", to: "john", label: "追跡", type: "rival" },
      { from: "t800", to: "t1000", label: "敵対", type: "rival" },
      { from: "t800", to: "sarah", label: "信頼", type: "ally" },
      { from: "dyson", to: "t800", label: "協力", type: "ally" },
    ],
  },

  // ブレイキング・バッド (1396, TV)
  {
    movieId: 1396,
    mediaType: "tv",
    title: "ブレイキング・バッド",
    characters: [
      { id: "walt", name: "ウォルター", actorName: "ブライアン・クランストン", x: 50, y: 15, isProtagonist: true },
      { id: "jesse", name: "ジェシー", actorName: "アーロン・ポール", x: 15, y: 42 },
      { id: "skyler", name: "スカイラー", actorName: "アンナ・ガン", x: 85, y: 25 },
      { id: "hank", name: "ハンク", actorName: "ディーン・ノリス", x: 85, y: 62 },
      { id: "saul", name: "ソウル", actorName: "ボブ・オデンカーク", x: 50, y: 85 },
      { id: "gus", name: "ガス", actorName: "ジャンカルロ・エスポジート", x: 15, y: 85 },
    ],
    relationships: [
      { from: "walt", to: "jesse", label: "師弟→対立", type: "mentor" },
      { from: "walt", to: "skyler", label: "夫婦", type: "family" },
      { from: "walt", to: "hank", label: "義兄弟", type: "family" },
      { from: "walt", to: "gus", label: "敵対", type: "rival" },
      { from: "walt", to: "saul", label: "弁護士", type: "ally" },
      { from: "jesse", to: "gus", label: "利用", type: "rival" },
      { from: "hank", to: "walt", label: "追跡", type: "rival" },
    ],
  },

  // 千と千尋の神隠し (129)
  {
    movieId: 129,
    mediaType: "movie",
    title: "千と千尋の神隠し",
    characters: [
      { id: "chihiro", name: "千尋", actorName: "柊瑠美", x: 50, y: 18, isProtagonist: true },
      { id: "haku", name: "ハク", actorName: "入野自由", x: 15, y: 40 },
      { id: "yubaba", name: "湯婆婆", actorName: "夏木マリ", x: 85, y: 30 },
      { id: "kaonashi", name: "カオナシ", actorName: "中村彰男", x: 50, y: 68 },
      { id: "kamaji", name: "釜爺", actorName: "菅原文太", x: 15, y: 78 },
      { id: "lin", name: "リン", actorName: "玉井夕海", x: 85, y: 72 },
    ],
    relationships: [
      { from: "chihiro", to: "haku", label: "恋心", type: "love" },
      { from: "chihiro", to: "yubaba", label: "支配", type: "rival" },
      { from: "chihiro", to: "kaonashi", label: "友情", type: "ally" },
      { from: "haku", to: "yubaba", label: "弟子", type: "mentor" },
      { from: "kamaji", to: "chihiro", label: "助力", type: "mentor" },
      { from: "lin", to: "chihiro", label: "先輩", type: "ally" },
    ],
  },

  // トップガン マーヴェリック (361743)
  {
    movieId: 361743,
    mediaType: "movie",
    title: "トップガン マーヴェリック",
    characters: [
      { id: "mav", name: "マーヴェリック", actorName: "トム・クルーズ", x: 50, y: 15, isProtagonist: true },
      { id: "rooster", name: "ルースター", actorName: "マイルズ・テラー", x: 15, y: 50 },
      { id: "penny", name: "ペニー", actorName: "ジェニファー・コネリー", x: 85, y: 25 },
      { id: "ice", name: "アイスマン", actorName: "ヴァル・キルマー", x: 85, y: 62 },
      { id: "hangman", name: "ハングマン", actorName: "グレン・パウエル", x: 15, y: 85 },
      { id: "cyclone", name: "サイクロン", actorName: "ジョン・ハム", x: 50, y: 85 },
    ],
    relationships: [
      { from: "mav", to: "rooster", label: "師弟・代理父", type: "mentor" },
      { from: "mav", to: "penny", label: "恋人", type: "love" },
      { from: "mav", to: "ice", label: "親友", type: "ally" },
      { from: "rooster", to: "hangman", label: "ライバル", type: "rival" },
      { from: "mav", to: "cyclone", label: "対立", type: "rival" },
      { from: "rooster", to: "mav", label: "父の戦友", type: "family" },
    ],
  },

  // 最後のジェダイ (181808)
  {
    movieId: 181808,
    mediaType: "movie",
    title: "スター・ウォーズ 最後のジェダイ",
    characters: [
      { id: "rey", name: "レイ", actorName: "デイジー・リドリー", x: 30, y: 15, isProtagonist: true },
      { id: "kylo", name: "カイロ・レン", actorName: "アダム・ドライバー", x: 70, y: 15 },
      { id: "luke", name: "ルーク", actorName: "マーク・ハミル", x: 12, y: 50 },
      { id: "leia", name: "レイア", actorName: "キャリー・フィッシャー", x: 50, y: 55 },
      { id: "finn", name: "フィン", actorName: "ジョン・ボイエガ", x: 50, y: 85 },
      { id: "poe", name: "ポー", actorName: "オスカー・アイザック", x: 88, y: 55 },
    ],
    relationships: [
      { from: "rey", to: "luke", label: "師弟", type: "mentor" },
      { from: "rey", to: "kylo", label: "フォースの絆", type: "neutral" },
      { from: "kylo", to: "leia", label: "母子", type: "family" },
      { from: "luke", to: "leia", label: "兄妹", type: "family" },
      { from: "luke", to: "kylo", label: "元師弟", type: "mentor" },
      { from: "finn", to: "rey", label: "仲間", type: "ally" },
      { from: "poe", to: "leia", label: "信頼", type: "ally" },
    ],
  },

  // ジュラシック・ワールド 炎の王国 (351286)
  {
    movieId: 351286,
    mediaType: "movie",
    title: "ジュラシック・ワールド 炎の王国",
    characters: [
      { id: "owen", name: "オーウェン", actorName: "クリス・プラット", x: 30, y: 15, isProtagonist: true },
      { id: "claire", name: "クレア", actorName: "ブライス・ダラス・ハワード", x: 70, y: 15 },
      { id: "lockwood", name: "ロックウッド", actorName: "ジェームズ・クロムウェル", x: 85, y: 55 },
      { id: "mills", name: "ミルズ", actorName: "レイフ・スポール", x: 85, y: 82 },
      { id: "maisie", name: "メイジー", actorName: "Isabella Sermon", x: 50, y: 55 },
      { id: "malcolm", name: "マルコム博士", actorName: "ジェフ・ゴールドブラム", x: 15, y: 82 },
    ],
    relationships: [
      { from: "owen", to: "claire", label: "恋人", type: "love" },
      { from: "owen", to: "maisie", label: "守護者", type: "ally" },
      { from: "maisie", to: "lockwood", label: "祖父と孫", type: "family" },
      { from: "mills", to: "lockwood", label: "裏切り", type: "rival" },
      { from: "mills", to: "owen", label: "敵対", type: "rival" },
      { from: "claire", to: "maisie", label: "保護", type: "ally" },
    ],
  },

  // グレイテスト・ショーマン (316029)
  {
    movieId: 316029,
    mediaType: "movie",
    title: "グレイテスト・ショーマン",
    characters: [
      { id: "barnum", name: "P.T.バーナム", actorName: "ヒュー・ジャックマン", x: 50, y: 15, isProtagonist: true },
      { id: "charity", name: "チャリティ", actorName: "ミシェル・ウィリアムズ", x: 15, y: 30 },
      { id: "phillip", name: "フィリップ", actorName: "ザック・エフロン", x: 85, y: 32 },
      { id: "anne", name: "アン", actorName: "ゼンデイヤ", x: 85, y: 68 },
      { id: "jenny", name: "ジェニー・リンド", actorName: "レベッカ・ファーガソン", x: 15, y: 72 },
    ],
    relationships: [
      { from: "barnum", to: "charity", label: "夫婦", type: "family" },
      { from: "barnum", to: "phillip", label: "パートナー", type: "ally" },
      { from: "phillip", to: "anne", label: "恋人", type: "love" },
      { from: "barnum", to: "jenny", label: "魅了", type: "love" },
      { from: "jenny", to: "charity", label: "三角関係", type: "rival" },
    ],
  },

  // アベンジャーズ インフィニティ・ウォー (299536)
  {
    movieId: 299536,
    mediaType: "movie",
    title: "アベンジャーズ インフィニティ・ウォー",
    characters: [
      { id: "thanos", name: "サノス", actorName: "ジョシュ・ブローリン", x: 50, y: 12, isProtagonist: true },
      { id: "tony", name: "アイアンマン", actorName: "ロバート・ダウニー・Jr", x: 12, y: 35 },
      { id: "thor", name: "ソー", actorName: "クリス・ヘムズワース", x: 88, y: 35 },
      { id: "spider", name: "スパイダーマン", actorName: "トム・ホランド", x: 12, y: 72 },
      { id: "gamora", name: "ガモーラ", actorName: "ゾーイ・サルダナ", x: 70, y: 55 },
      { id: "strange", name: "ドクター・ストレンジ", actorName: "ベネディクト・カンバーバッチ", x: 35, y: 72 },
      { id: "cap", name: "キャプテン・アメリカ", actorName: "クリス・エヴァンス", x: 88, y: 72 },
    ],
    relationships: [
      { from: "thanos", to: "gamora", label: "養父と娘", type: "family" },
      { from: "thanos", to: "spider", label: "敵対", type: "rival" },
      { from: "tony", to: "spider", label: "師弟", type: "mentor" },
      { from: "thor", to: "thanos", label: "復讐", type: "rival" },
      { from: "cap", to: "thor", label: "仲間", type: "ally" },
      { from: "strange", to: "thanos", label: "タイムストーン", type: "rival" },
    ],
  },

  // MI フォールアウト (353081)
  {
    movieId: 353081,
    mediaType: "movie",
    title: "ミッション:インポッシブル フォールアウト",
    characters: [
      { id: "ethan", name: "イーサン・ハント", actorName: "トム・クルーズ", x: 50, y: 15, isProtagonist: true },
      { id: "walker", name: "ウォーカー", actorName: "ヘンリー・カヴィル", x: 85, y: 28 },
      { id: "benji", name: "ベンジー", actorName: "サイモン・ペッグ", x: 15, y: 42 },
      { id: "luther", name: "ルーサー", actorName: "ヴィング・レイムス", x: 15, y: 75 },
      { id: "ilsa", name: "イルサ", actorName: "レベッカ・ファーガソン", x: 85, y: 65 },
      { id: "widow", name: "ホワイト・ウィドウ", actorName: "ヴァネッサ・カービー", x: 50, y: 85 },
    ],
    relationships: [
      { from: "ethan", to: "benji", label: "相棒", type: "ally" },
      { from: "ethan", to: "luther", label: "相棒", type: "ally" },
      { from: "ethan", to: "ilsa", label: "恋心", type: "love" },
      { from: "ethan", to: "walker", label: "敵対", type: "rival" },
      { from: "walker", to: "widow", label: "取引", type: "neutral" },
      { from: "ethan", to: "widow", label: "交渉", type: "neutral" },
    ],
  },

  // レディ・プレイヤー1 (333339)
  {
    movieId: 333339,
    mediaType: "movie",
    title: "レディ・プレイヤー1",
    characters: [
      { id: "wade", name: "ウェイド / パーシヴァル", actorName: "タイ・シェリダン", x: 50, y: 15, isProtagonist: true },
      { id: "sam", name: "サマンサ / アルテミス", actorName: "オリヴィア・クック", x: 15, y: 42 },
      { id: "halliday", name: "ハリデー", actorName: "マーク・ライランス", x: 50, y: 78 },
      { id: "sorrento", name: "ソレント", actorName: "ベン・メンデルソーン", x: 85, y: 42 },
      { id: "aech", name: "エイチ", actorName: "リナ・ウェイス", x: 15, y: 78 },
    ],
    relationships: [
      { from: "wade", to: "sam", label: "恋人", type: "love" },
      { from: "wade", to: "halliday", label: "憧れ", type: "mentor" },
      { from: "wade", to: "sorrento", label: "敵対", type: "rival" },
      { from: "wade", to: "aech", label: "親友", type: "ally" },
      { from: "sam", to: "sorrento", label: "敵対", type: "rival" },
    ],
  },

  // ファンタスティック・ビースト (259316)
  {
    movieId: 259316,
    mediaType: "movie",
    title: "ファンタスティック・ビーストと魔法使いの旅",
    characters: [
      { id: "newt", name: "ニュート", actorName: "エディ・レッドメイン", x: 50, y: 15, isProtagonist: true },
      { id: "tina", name: "ティナ", actorName: "キャサリン・ウォーターストン", x: 15, y: 40 },
      { id: "jacob", name: "ジェイコブ", actorName: "ダン・フォグラー", x: 85, y: 40 },
      { id: "queenie", name: "クイニー", actorName: "アリソン・スドル", x: 85, y: 72 },
      { id: "graves", name: "グレイブス", actorName: "コリン・ファレル", x: 15, y: 78 },
      { id: "credence", name: "クリーデンス", actorName: "エズラ・ミラー", x: 50, y: 85 },
    ],
    relationships: [
      { from: "newt", to: "tina", label: "恋心", type: "love" },
      { from: "jacob", to: "queenie", label: "恋人", type: "love" },
      { from: "newt", to: "jacob", label: "友人", type: "ally" },
      { from: "graves", to: "credence", label: "利用", type: "rival" },
      { from: "tina", to: "graves", label: "上司", type: "neutral" },
      { from: "newt", to: "graves", label: "敵対", type: "rival" },
    ],
  },

  // コナン ゼロの執行人 (493006)
  {
    movieId: 493006,
    mediaType: "movie",
    title: "名探偵コナン ゼロの執行人",
    characters: [
      { id: "conan", name: "江戸川コナン", actorName: "高山みなみ", x: 50, y: 15, isProtagonist: true },
      { id: "amuro", name: "安室透", actorName: "古谷徹", x: 50, y: 60 },
      { id: "ran", name: "毛利蘭", actorName: "山崎和佳奈", x: 15, y: 32 },
      { id: "kogoro", name: "毛利小五郎", actorName: "小山力也", x: 15, y: 68 },
      { id: "kazami", name: "風見裕也", actorName: "飛田展男", x: 85, y: 60 },
    ],
    relationships: [
      { from: "conan", to: "amuro", label: "対峙", type: "rival" },
      { from: "conan", to: "ran", label: "幼馴染", type: "love" },
      { from: "ran", to: "kogoro", label: "親子", type: "family" },
      { from: "amuro", to: "kazami", label: "上司", type: "ally" },
      { from: "conan", to: "kogoro", label: "居候", type: "family" },
    ],
  },

  // コナン 純黒の悪夢 (374856)
  {
    movieId: 374856,
    mediaType: "movie",
    title: "名探偵コナン 純黒の悪夢",
    characters: [
      { id: "conan", name: "江戸川コナン", actorName: "高山みなみ", x: 50, y: 15, isProtagonist: true },
      { id: "akai", name: "赤井秀一", actorName: "池田秀一", x: 15, y: 42 },
      { id: "amuro", name: "安室透", actorName: "古谷徹", x: 85, y: 42 },
      { id: "curacao", name: "キュラソー", actorName: "天海祐希", x: 50, y: 65 },
      { id: "gin", name: "ジン", actorName: "堀之紀", x: 85, y: 82 },
    ],
    relationships: [
      { from: "conan", to: "curacao", label: "保護", type: "ally" },
      { from: "akai", to: "amuro", label: "宿敵", type: "rival" },
      { from: "akai", to: "conan", label: "協力", type: "ally" },
      { from: "amuro", to: "conan", label: "協力", type: "ally" },
      { from: "curacao", to: "gin", label: "組織", type: "neutral" },
      { from: "gin", to: "conan", label: "敵対", type: "rival" },
    ],
  },

  // 鬼滅の刃 無限列車編 (635302)
  {
    movieId: 635302,
    mediaType: "movie",
    title: "鬼滅の刃 無限列車編",
    characters: [
      { id: "tanjiro", name: "竈門炭治郎", actorName: "花江夏樹", x: 50, y: 15, isProtagonist: true },
      { id: "nezuko", name: "竈門禰豆子", actorName: "鬼頭明里", x: 15, y: 28 },
      { id: "rengoku", name: "煉獄杏寿郎", actorName: "日野聡", x: 50, y: 55 },
      { id: "akaza", name: "猗窩座", actorName: "石田彰", x: 85, y: 55 },
      { id: "enmu", name: "魘夢", actorName: "平川大輔", x: 85, y: 22 },
      { id: "zenitsu", name: "我妻善逸", actorName: "下野紘", x: 15, y: 65 },
    ],
    relationships: [
      { from: "tanjiro", to: "nezuko", label: "兄妹", type: "family" },
      { from: "tanjiro", to: "rengoku", label: "師弟", type: "mentor" },
      { from: "rengoku", to: "akaza", label: "死闘", type: "rival" },
      { from: "tanjiro", to: "enmu", label: "敵対", type: "rival" },
      { from: "tanjiro", to: "zenitsu", label: "仲間", type: "ally" },
      { from: "rengoku", to: "tanjiro", label: "託す", type: "mentor" },
    ],
  },

  // となりのトトロ (8392)
  {
    movieId: 8392,
    mediaType: "movie",
    title: "となりのトトロ",
    characters: [
      { id: "satsuki", name: "サツキ", actorName: "日髙のり子", x: 32, y: 15, isProtagonist: true },
      { id: "mei", name: "メイ", actorName: "坂本千夏", x: 68, y: 15 },
      { id: "totoro", name: "トトロ", actorName: "高木均", x: 50, y: 55 },
      { id: "father", name: "お父さん", actorName: "糸井重里", x: 15, y: 55 },
      { id: "mother", name: "お母さん", actorName: "島本須美", x: 85, y: 55 },
      { id: "catbus", name: "ネコバス", actorName: "龍田直樹", x: 50, y: 88 },
    ],
    relationships: [
      { from: "satsuki", to: "mei", label: "姉妹", type: "family" },
      { from: "satsuki", to: "totoro", label: "出会い", type: "ally" },
      { from: "mei", to: "totoro", label: "友達", type: "ally" },
      { from: "father", to: "satsuki", label: "父娘", type: "family" },
      { from: "father", to: "mother", label: "夫婦", type: "family" },
      { from: "totoro", to: "catbus", label: "仲間", type: "ally" },
    ],
  },

  // グリーンマイル (497)
  {
    movieId: 497,
    mediaType: "movie",
    title: "グリーンマイル",
    characters: [
      { id: "paul", name: "ポール", actorName: "トム・ハンクス", x: 50, y: 15, isProtagonist: true },
      { id: "coffey", name: "ジョン・コーフィ", actorName: "マイケル・クラーク・ダンカン", x: 50, y: 55 },
      { id: "percy", name: "パーシー", actorName: "Doug Hutchison", x: 85, y: 32 },
      { id: "bill", name: "ワイルド・ビル", actorName: "サム・ロックウェル", x: 85, y: 72 },
      { id: "brutal", name: "ブルータス", actorName: "デヴィッド・モース", x: 15, y: 42 },
    ],
    relationships: [
      { from: "paul", to: "coffey", label: "信頼", type: "ally" },
      { from: "paul", to: "brutal", label: "同僚", type: "ally" },
      { from: "percy", to: "coffey", label: "虐待", type: "rival" },
      { from: "bill", to: "coffey", label: "真犯人", type: "rival" },
      { from: "paul", to: "percy", label: "嫌悪", type: "rival" },
    ],
  },

  // アバター (19995)
  {
    movieId: 19995,
    mediaType: "movie",
    title: "アバター",
    characters: [
      { id: "jake", name: "ジェイク", actorName: "サム・ワーシントン", x: 50, y: 15, isProtagonist: true },
      { id: "neytiri", name: "ネイティリ", actorName: "ゾーイ・サルダナ", x: 15, y: 40 },
      { id: "quaritch", name: "マイルズ大佐", actorName: "スティーヴン・ラング", x: 85, y: 28 },
      { id: "grace", name: "グレイス博士", actorName: "シガニー・ウィーバー", x: 15, y: 75 },
      { id: "trudy", name: "トゥルーディ", actorName: "ミシェル・ロドリゲス", x: 85, y: 72 },
    ],
    relationships: [
      { from: "jake", to: "neytiri", label: "恋人", type: "love" },
      { from: "jake", to: "quaritch", label: "敵対", type: "rival" },
      { from: "jake", to: "grace", label: "師弟", type: "mentor" },
      { from: "neytiri", to: "jake", label: "導き", type: "mentor" },
      { from: "trudy", to: "jake", label: "味方", type: "ally" },
    ],
  },

  // ユージュアル・サスペクツ (629)
  {
    movieId: 629,
    mediaType: "movie",
    title: "ユージュアル・サスペクツ",
    characters: [
      { id: "verbal", name: "ヴァーバル", actorName: "ケヴィン・スペイシー", x: 50, y: 15, isProtagonist: true },
      { id: "kujan", name: "クイヤン捜査官", actorName: "Chazz Palminteri", x: 85, y: 18 },
      { id: "keaton", name: "キートン", actorName: "ガブリエル・バーン", x: 15, y: 45 },
      { id: "mcmanus", name: "マクマナス", actorName: "Stephen Baldwin", x: 85, y: 55 },
      { id: "fenster", name: "フェンスター", actorName: "ベニチオ・デル・トロ", x: 15, y: 78 },
    ],
    relationships: [
      { from: "verbal", to: "kujan", label: "供述", type: "neutral" },
      { from: "verbal", to: "keaton", label: "仲間", type: "ally" },
      { from: "keaton", to: "mcmanus", label: "仲間", type: "ally" },
      { from: "keaton", to: "fenster", label: "仲間", type: "ally" },
      { from: "kujan", to: "keaton", label: "捜査", type: "rival" },
    ],
  },

  // ノマドランド (581734)
  {
    movieId: 581734,
    mediaType: "movie",
    title: "ノマドランド",
    characters: [
      { id: "fern", name: "ファーン", actorName: "フランシス・マクドーマンド", x: 50, y: 18, isProtagonist: true },
      { id: "dave", name: "デイブ", actorName: "デヴィッド・ストラザーン", x: 15, y: 48 },
      { id: "linda", name: "リンダ・メイ", actorName: "Linda May", x: 85, y: 38 },
      { id: "swankie", name: "スワンキー", actorName: "Swankie", x: 85, y: 72 },
      { id: "bob", name: "ボブ・ウェルズ", actorName: "Bob Wells", x: 25, y: 82 },
    ],
    relationships: [
      { from: "fern", to: "dave", label: "好意", type: "love" },
      { from: "fern", to: "linda", label: "友人", type: "ally" },
      { from: "fern", to: "swankie", label: "友人", type: "ally" },
      { from: "fern", to: "bob", label: "導き", type: "mentor" },
    ],
  },

  // ジョーカー (475557)
  {
    movieId: 475557,
    mediaType: "movie",
    title: "ジョーカー",
    characters: [
      { id: "arthur", name: "アーサー / ジョーカー", actorName: "ホアキン・フェニックス", x: 50, y: 15, isProtagonist: true },
      { id: "murray", name: "マレー", actorName: "ロバート・デ・ニーロ", x: 85, y: 28 },
      { id: "sophie", name: "ソフィー", actorName: "ザジー・ビーツ", x: 15, y: 40 },
      { id: "penny", name: "ペニー", actorName: "フランセス・コンロイ", x: 15, y: 72 },
      { id: "wayne", name: "トーマス・ウェイン", actorName: "Brett Cullen", x: 85, y: 72 },
    ],
    relationships: [
      { from: "arthur", to: "penny", label: "母子", type: "family" },
      { from: "arthur", to: "murray", label: "憧れ→殺害", type: "rival" },
      { from: "arthur", to: "sophie", label: "妄想の恋", type: "love" },
      { from: "arthur", to: "wayne", label: "父？", type: "family" },
      { from: "penny", to: "wayne", label: "過去の関係", type: "neutral" },
    ],
  },

  // ハリー・ポッターと賢者の石 (671)
  {
    movieId: 671,
    mediaType: "movie",
    title: "ハリー・ポッターと賢者の石",
    characters: [
      { id: "harry", name: "ハリー", actorName: "ダニエル・ラドクリフ", x: 50, y: 12, isProtagonist: true },
      { id: "ron", name: "ロン", actorName: "ルパート・グリント", x: 15, y: 30 },
      { id: "hermione", name: "ハーマイオニー", actorName: "エマ・ワトソン", x: 85, y: 30 },
      { id: "dumbledore", name: "ダンブルドア", actorName: "リチャード・ハリス", x: 50, y: 58 },
      { id: "snape", name: "スネイプ", actorName: "アラン・リックマン", x: 15, y: 78 },
      { id: "hagrid", name: "ハグリッド", actorName: "ロビー・コルトレーン", x: 85, y: 78 },
    ],
    relationships: [
      { from: "harry", to: "ron", label: "親友", type: "ally" },
      { from: "harry", to: "hermione", label: "親友", type: "ally" },
      { from: "harry", to: "dumbledore", label: "導き", type: "mentor" },
      { from: "harry", to: "snape", label: "敵意？", type: "rival" },
      { from: "harry", to: "hagrid", label: "友人", type: "ally" },
      { from: "ron", to: "hermione", label: "友人", type: "ally" },
      { from: "dumbledore", to: "snape", label: "信頼", type: "ally" },
    ],
  },
];

export function getRelationData(movieId: number): MovieRelationData | undefined {
  return ALL_RELATIONS.find((r) => r.movieId === movieId);
}

export function getAllRelationMovieIds(): number[] {
  return ALL_RELATIONS.map((r) => r.movieId);
}
