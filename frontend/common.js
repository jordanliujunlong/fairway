// ═══════════════════════════════════════════
// FAIRWAY — 共通設定・関数
// ═══════════════════════════════════════════

const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : '';

const PRODUCTS = [
  {id:13,cat:'goods',brand:'PEARLY GATES × Hello Kitty',name:'Hello Kitty Driver Head Cover',img:'pg_kitty_set',gallery:['pg_kitty_set','kitty_headcover','knit_headcover'],desc:'ハローキティ×パーリーゲイツ。マスコット型ドライバーヘッドカバー。',descLong:'PEARLY GATESとサンリオのコラボレーションによる限定ヘッドカバー。ゴルフクラブを持ったハローキティのぬいぐるみタイプで、ブラック×ピンクの配色がコースで映えます。首元にはPEARLY GATESロゴ入りニットソックが付属し、シャフトまでしっかり保護。ヘッドカバー単品でのお届けです。',price:18500,badge:'NEW',icon:null,specs:[['ブランド','PEARLY GATES × Hello Kitty'],['カラー','ブラック × ピンク'],['対応クラブ','ドライバー用（1W）'],['素材','ポリエステル・ニット'],['付属','ロゴ入りニットソック']],rating:4.9,reviews:[{user:'田中 M.',date:'2026.06.20',text:'キティちゃんが可愛すぎる！コースで目立ちます。'},{user:'佐藤 Y.',date:'2026.06.25',text:'思ったより大きくて存在感抜群です。'}]},
  {id:20,cat:'goods',brand:'Blended',name:'King of Diamonds Head Cover',img:'taotao_3',gallery:['taotao_3','taotao_4','taotao_1','taotao_2'],desc:'スカルキング×ダイヤ柄。存在感抜群のドライバー用ヘッドカバー。',descLong:'トランプの「キング」をスカルデザインで表現した個性派ヘッドカバー。精緻な刺繍とプレミアムPUレザーを使用。表面はスカルキング刺繍、裏面はシンプルなホワイト。「Blended」ロゴ入り。ドライバー（1W）対応。',price:14800,badge:'NEW',icon:null,specs:[['ブランド','Blended'],['デザイン','King of Diamonds スカル'],['対応クラブ','ドライバー用（1W）'],['素材','PUレザー・刺繍'],['カラー','ホワイト × マルチ']],rating:4.9,reviews:[{user:'田中 R.',date:'2026.07.10',text:'コースで絶対目立てる！クオリティも最高です。'},{user:'山本 K.',date:'2026.07.12',text:'プレゼントで貰いました。めちゃくちゃカッコいい！'}]},
  {id:21,cat:'goods',brand:'Wizard Golf',name:'Wizard Head Cover Set (Black)',img:'wiz_blk_1',gallery:['wiz_blk_1','wiz_blk_2','wiz_blk_3'],desc:'ウィザード刺繍3点セット。ブラック×ブルー。DR/FW/UT対応。',descLong:'ウィザード、スマイルボム、うさぎ、キャットのキャラクター刺繍をあしらった個性派ヘッドカバー3点セット。ブラックボディにブルー＆シルバーの刺繍が映えるデザイン。ドライバー・フェアウェイウッド・ユーティリティの3本セットでお届けします。',price:32800,badge:'NEW',icon:null,specs:[['ブランド','Wizard Golf'],['セット内容','DR / FW / UT の3点'],['カラー','ブラック × ブルー'],['素材','PUレザー・刺繍'],['取付','ドローコード式']],rating:4.9,reviews:[{user:'佐藤 D.',date:'2026.07.14',text:'刺繍のクオリティが高くて満足です！'},{user:'高橋 N.',date:'2026.07.16',text:'3本セットでこの価格はお買い得。'}]},
  {id:22,cat:'goods',brand:'Wizard Golf',name:'Wizard Head Cover Set (White)',img:'wiz_wht_1',gallery:['wiz_wht_1','wiz_wht_2','wiz_wht_3'],desc:'ウィザード刺繍3点セット。ホワイト×グリーン。DR/FW/UT対応。',descLong:'ウィザード、スマイルボム、うさぎ、キャットのキャラクター刺繍をあしらった個性派ヘッドカバー3点セット。ホワイトボディにグリーン＆シルバーの刺繍が上品に映えるデザイン。ドライバー・フェアウェイウッド・ユーティリティの3本セットでお届けします。',price:32800,badge:'NEW',icon:null,specs:[['ブランド','Wizard Golf'],['セット内容','DR / FW / UT の3点'],['カラー','ホワイト × グリーン'],['素材','PUレザー・刺繍'],['取付','ドローコード式']],rating:4.8,reviews:[{user:'渡辺 A.',date:'2026.07.15',text:'白がとても綺麗。汚れが心配ですが可愛い！'}]},
  {id:23,cat:'goods',brand:'Craftsman Golf',name:'US Flag Iron Cover Set (Navy)',img:'iron_navy_1',gallery:['iron_navy_1','iron_navy_2','iron_navy_5','iron_navy_4','iron_navy_3','iron_navy_6'],desc:'星条旗デザインのアイアンカバー10点セット。ネオプレン製。',descLong:'Craftsman Golf のUSフラッグデザイン・アイアンヘッドカバー10点セット（4/5/6/7/8/9/PW/AW/SW/LW）。伸縮性に優れた高品質ネオプレン素材を使用し、ほとんどの標準アイアンヘッドにフィット。片手でスムーズに着脱でき、通気性・耐久性も抜群。洗濯機で丸洗いできます。',price:6800,badge:'NEW',icon:null,specs:[['ブランド','Craftsman Golf'],['セット内容','10点（4〜LW）'],['カラー','ネイビー × ホワイト'],['素材','ネオプレン'],['サイズ','約14×7cm（5.51×2.76in）'],['お手入れ','洗濯機可']],rating:4.7,reviews:[{user:'木村 T.',date:'2026.07.11',text:'番手が見やすくて便利。着脱もスムーズです。'},{user:'井上 S.',date:'2026.07.14',text:'アイアン同士がぶつからず安心。コスパ良し！'}]},
  {id:24,cat:'goods',brand:'Craftsman Golf',name:'US Flag Iron Cover Set (Blue)',img:'iron_blue_1',gallery:['iron_blue_1','iron_blue_2','iron_navy_5','iron_navy_4','iron_navy_3'],desc:'星条旗デザインのアイアンカバー10点セット。鮮やかなブルー。',descLong:'Craftsman Golf のUSフラッグデザイン・アイアンヘッドカバー10点セット（4/5/6/7/8/9/PW/AW/SW/LW）。鮮やかなロイヤルブルーが目を引くカラー。伸縮性に優れた高品質ネオプレン素材で、ほとんどの標準アイアンヘッドにフィットします。洗濯機で丸洗い可能。',price:6800,badge:null,icon:null,specs:[['ブランド','Craftsman Golf'],['セット内容','10点（4〜LW）'],['カラー','ブルー × ホワイト'],['素材','ネオプレン'],['サイズ','約14×7cm（5.51×2.76in）'],['お手入れ','洗濯機可']],rating:4.6,reviews:[{user:'岡田 M.',date:'2026.07.13',text:'色が鮮やかでバッグが華やかになりました。'}]},
    {id:29,cat:'goods',brand:'Creative Covers',name:'Dracula Driver Head Cover',img:'drac_1',gallery:['drac_1','drac_2','drac_3'],desc:'ドラキュラ伯爵のぬいぐるみヘッドカバー。マント付き。',descLong:'Creative Covers のドラキュラ伯爵ヘッドカバー。牙と赤いマントがユニークなぬいぐるみタイプで、コースでの話題づくりに最適。芝生を模したベース付きで自立します。ドライバー（1W）対応、内部は起毛素材でクラブを保護します。',price:7800,badge:'NEW',icon:null,specs:[['ブランド','Creative Covers'],['デザイン','ドラキュラ伯爵'],['対応クラブ','ドライバー用（1W）'],['素材','ポリエステル / ぬいぐるみ'],['特徴','マント付き・自立ベース']],rating:4.8,reviews:[{user:'原田 Y.',date:'2026.07.16',text:'同伴者に必ず笑われます。最高です！'}]},
  {id:30,cat:'goods',brand:"CM's Custom Studio",name:'Charles Schwab Challenge Putter Cover',img:'schwab_1',gallery:['schwab_1','schwab_2','schwab_3','schwab_4'],desc:'テキサス・ロングホーン刺繍のブレード型パターカバー。限定品。',descLong:"CM's Custom Studio のリミテッドエディション・パターカバー。Charles Schwab Challenge（フォートワース、テキサス）をモチーフに、ロングホーン牛とレザーのゴルフバッグ、ロープ刺繍を丁寧に施した逸品。ブレード型パター対応、マグネット開閉式。",price:12800,badge:'NEW',icon:null,specs:[['ブランド',"CM's Custom Studio"],['デザイン','Charles Schwab Challenge'],['対応','ブレード型パター'],['素材','PUレザー・刺繍'],['開閉','マグネット式'],['備考','Limited Edition']],rating:5.0,reviews:[{user:'内田 K.',date:'2026.07.15',text:'刺繍の作り込みが素晴らしい。コレクション行きです。'}]},
  {id:31,cat:'goods',brand:'Creative Covers',name:'Fire Dragon Driver Head Cover',img:'drag_1',gallery:['drag_1','drag_2','drag_3'],desc:'オレンジのファイアドラゴン。翼＆炎の尻尾付き。',descLong:'迫力あるファイアドラゴンのぬいぐるみヘッドカバー。ブルーの翼と炎をあしらった尻尾が特徴的で、コースでひときわ目立ちます。ロングソックタイプでシャフトまでしっかり保護。ドライバー（1W）対応。',price:8900,badge:'NEW',icon:null,specs:[['ブランド','Creative Covers'],['デザイン','ファイアドラゴン'],['対応クラブ','ドライバー用（1W）'],['素材','ポリエステル / ぬいぐるみ'],['特徴','ロングソック・翼付き']],rating:4.9,reviews:[{user:'小川 T.',date:'2026.07.14',text:'子供にも大人気！かわいくて気に入っています。'},{user:'斉藤 M.',date:'2026.07.17',text:'シャフトまで守ってくれるのが良い。'}]},
  {id:32,cat:'goods',brand:'TaylorMade',name:'Hawaii Driver Head Cover',img:'haw_dr_1',gallery:['haw_dr_1','haw_dr_2','haw_dr_3'],desc:'ダイヤモンドヘッド＆ヤシの木。ハワイ限定デザイン。',descLong:'TaylorMade のハワイ限定ドライバーヘッドカバー。ダイヤモンドヘッド、ヤシの木、波打ち際を刺繍とアップリケで表現した美しいデザイン。ハイビスカスをあしらった TaylorMade ロゴがアクセント。ドライバー（1W）対応。',price:9800,badge:'NEW',icon:null,specs:[['ブランド','TaylorMade'],['デザイン','Hawaii Limited'],['対応クラブ','ドライバー用（1W）'],['素材','PUレザー・刺繍'],['備考','ハワイ限定モデル']],rating:4.9,reviews:[{user:'松井 R.',date:'2026.07.13',text:'ハワイ旅行の思い出に購入。デザインが最高です。'}]},
  {id:33,cat:'goods',brand:'TaylorMade',name:'Hawaii Mallet Putter Cover',img:'haw_pt_1',gallery:['haw_pt_1','haw_pt_2'],desc:'フラダンサー刺繍のマレット型パターカバー。ハワイ限定。',descLong:'TaylorMade のハワイ限定パターカバー。フラダンサーとダイヤモンドヘッドを繊細な刺繍で表現。スカートには立体的なフェルト素材を使用しています。マレット型パター対応、マグネット開閉式。',price:8500,badge:null,icon:null,specs:[['ブランド','TaylorMade'],['デザイン','Hawaii Limited / フラダンサー'],['対応','マレット型パター'],['素材','PUレザー・刺繍・フェルト'],['開閉','マグネット式']],rating:4.8,reviews:[{user:'岩田 S.',date:'2026.07.12',text:'ドライバーカバーとお揃いで揃えました！'}]},
  {id:34,cat:'goods',brand:'Titleist',name:'Alignment Stick Cover (White)',img:'tit_align_1',gallery:['tit_align_1','tit_align_2'],desc:'アライメントスティック用レザーカバー。立体ロゴ入り。',descLong:'Titleist のアライメントスティックカバー。ホワイトのレザー調素材に、赤枠×黒の立体ラバーロゴがアクセント。2本のアライメントスティックを収納でき、バッグ内でスマートに持ち運べます。',price:4800,badge:null,icon:null,specs:[['ブランド','Titleist'],['対応','アライメントスティック2本'],['カラー','ホワイト'],['素材','PUレザー'],['ロゴ','立体ラバーパッチ']],rating:4.6,reviews:[{user:'谷口 H.',date:'2026.07.11',text:'シンプルで上品。バッグに映えます。'}]},
  {id:35,cat:'goods',brand:'OGIO',name:'Palm Tree Driver Head Cover',img:'ogio_1',gallery:['ogio_1'],desc:'モノトーンのヤシの木プリント。スタイリッシュな一本。',descLong:'OGIO のパームツリープリント・ドライバーヘッドカバー。モノクロのヤシの木シルエットがスタイリッシュな印象。耐久性の高いキャンバス地を使用し、内側は起毛素材でクラブヘッドを優しく保護します。',price:6200,badge:null,icon:null,specs:[['ブランド','OGIO'],['デザイン','パームツリー'],['対応クラブ','ドライバー用（1W）'],['カラー','ホワイト × ブラック'],['素材','キャンバス']],rating:4.5,reviews:[{user:'福田 J.',date:'2026.07.10',text:'モノトーンで合わせやすいです。'}]},
  {id:42,cat:'goods',brand:'Court Craft',name:'Pickleball Beaded Key Fob',img:'pickle_key_1',gallery:['pickle_key_1'],desc:'ビーズ刺繍のキーホルダー。カラフルなPICKLEBALLロゴ。',descLong:'一粒ずつ手作業でビーズを縫い付けたハンドメイドキーホルダー。白いスパンコールをベースに、カラフルなシードビーズで「PICKLEBALL」の文字を表現。ゴールドのカラビナ付きで、バッグやキーリングに気軽に取り付けられます。ギフトにも喜ばれる一品です。',price:50,badge:null,icon:null,specs:[['ブランド','Court Craft'],['素材','シードビーズ / スパンコール'],['金具','ゴールドカラビナ'],['サイズ','約15 × 3.5cm'],['製法','ハンドメイド']],rating:4.7,reviews:[{user:'久保 A.',date:'2026.07.16',text:'かわいくて友達へのギフトにしました！'}]},
  {id:25,cat:'wear',brand:'adidas GOLF',name:'MC80 Spikeless Golf Shoe',img:'mc80_1',gallery:['mc80_1','mc80_2','mc80_3'],desc:'クラシックなブローグデザイン×BOOSTクッション。スパイクレス。',descLong:'adidas MC80はクラシックなブローグシューズの佇まいに最新のゴルフテクノロジーを融合させたスパイクレスモデル。上質なレザーアッパーとグリーンのミッドソールトリムが上品な足元を演出。BOOSTミッドソールが一日中続く快適なクッショニングを提供します。',price:28600,badge:'NEW',icon:null,specs:[['ブランド','adidas GOLF'],['モデル','MC80'],['カラー','ホワイト × グリーン'],['アッパー','天然皮革'],['ソール','スパイクレス / BOOST'],['サイズ','25.0〜29.0cm']],rating:4.8,reviews:[{user:'長谷川 K.',date:'2026.07.12',text:'見た目が上品でクラブハウスでもそのまま歩けます。'},{user:'村田 S.',date:'2026.07.15',text:'BOOSTのクッションが最高。18ホール歩いても疲れません。'}]},
  {id:26,cat:'wear',brand:'PUMA GOLF',name:'IGNITE Innovate Spiked (Black)',img:'ignite_blk_1',gallery:['ignite_blk_1','ignite_blk_2','ignite_blk_3'],desc:'IGNITEフォーム搭載スパイクシューズ。オールブラック。',descLong:'PUMA GOLFのIGNITE Innovateは、反発性に優れたIGNITEフォームを搭載したスパイクモデル。安定感のあるアウトソールと交換可能なソフトスパイクで、あらゆるライからの強力なグリップを実現。防水設計で雨天のラウンドにも対応します。',price:22800,badge:'NEW',icon:null,specs:[['ブランド','PUMA GOLF'],['モデル','IGNITE Innovate'],['カラー','ブラック × シルバー'],['ソール','スパイク（交換可能）'],['機能','IGNITEフォーム / 防水'],['サイズ','25.0〜29.0cm']],rating:4.7,reviews:[{user:'藤井 R.',date:'2026.07.10',text:'グリップ力が段違い。雨の日も安心です。'}]},
  {id:27,cat:'wear',brand:'PUMA GOLF',name:'IGNITE Innovate Spiked (USA)',img:'ignite_usa_1',gallery:['ignite_usa_1','ignite_usa_2','ignite_usa_3','ignite_wb_1'],desc:'ホワイト×ネイビー×レッドの鮮やかなUSAカラー。',descLong:'PUMA GOLFのIGNITE Innovate USAカラー。ホワイトボディにネイビーとレッドのアクセントが映えるスポーティなデザイン。IGNITEフォームによる高反発クッションと交換式ソフトスパイクで、快適性とグリップ力を両立します。',price:22800,badge:null,icon:null,specs:[['ブランド','PUMA GOLF'],['モデル','IGNITE Innovate'],['カラー','ホワイト × ネイビー × レッド'],['ソール','スパイク（交換可能）'],['機能','IGNITEフォーム / 防水'],['サイズ','25.0〜29.0cm']],rating:4.6,reviews:[{user:'中川 D.',date:'2026.07.14',text:'色合いが最高にかっこいい！'}]},
  {id:28,cat:'bag',brand:'TaylorMade',name:'1909 Limited Tour Staff Bag',img:'tm1909_1',gallery:['tm1909_1','tm1909_2'],desc:'1909リミテッド。ゴールド刺繍×クラウンエンブレム。',descLong:'TaylorMadeの1909リミテッドエディション・ツアースタッフバッグ。アイボリーレザーにコッパーのアクセント、ゴールドの刺繍とクラウンエンブレムをあしらった限定モデル。フローラルパターンとグリーンのトリムが上品な佇まいを演出する、コレクター必見の一品です。',price:168000,badge:'NEW',icon:null,specs:[['ブランド','TaylorMade'],['モデル','1909 Limited Edition'],['カラー','アイボリー × コッパー × グリーン'],['タイプ','ツアースタッフバッグ'],['素材','PUレザー'],['備考','数量限定']],rating:5.0,reviews:[{user:'吉川 A.',date:'2026.07.16',text:'所有欲を満たしてくれる圧倒的な高級感。'}]},
 {id:36,cat:'bag',brand:'Star Wars Golf',name:'Darth Vader Tour Staff Bag',img:'vader_1',gallery:['vader_1','vader_2','vader_5','vader_3','vader_4'],desc:'ダースベイダー公式ライセンス。オールブラックのツアーバッグ。',descLong:'スター・ウォーズ公式ライセンスのダースベイダー・ツアースタッフバッグ。オールブラックのレザー調ボディに、エナメル仕上げの立体ヘルメットエンブレムを配置。サイドポケットにはベイダーのチェストパネルを再現したワッペン付き。ダークサイドの威厳をコースで放つ究極のコレクターズアイテムです。',price:198000,badge:'NEW',icon:null,specs:[['ブランド','Star Wars Golf'],['モデル','Darth Vader Tour Staff'],['カラー','ブラック'],['素材','PUレザー / エナメル'],['タイプ','ツアースタッフバッグ'],['備考','公式ライセンス品']],rating:5.0,reviews:[{user:'大野 T.',date:'2026.07.17',text:'圧倒的な存在感。ファンなら絶対手に入れるべき。'},{user:'今井 R.',date:'2026.07.18',text:'細部までこだわりが感じられます。'}]},
  {id:37,cat:'bag',brand:'SWAG Golf',name:'SWAG Neon Stand Bag',img:'swag_1',gallery:['swag_1'],desc:'ネオンカラーのポップアート。ブラック×ブルーのスタンドバッグ。',descLong:'SWAG Golf のネオンアート・スタンドバッグ。ブラックボディにブルーのパイピング、蛍光オレンジ＆イエローのポップアートグラフィックが強烈な個性を放ちます。軽量スタンド機能を搭載し、担ぎプレーも快適。個性を主張したいゴルファーへ。',price:78000,badge:'NEW',icon:null,specs:[['ブランド','SWAG Golf'],['カラー','ブラック × ブルー × ネオン'],['タイプ','スタンドバッグ'],['素材','ナイロン / PUレザー'],['機能','軽量スタンド / ダブルストラップ']],rating:4.8,reviews:[{user:'菊地 S.',date:'2026.07.16',text:'コースで一番目立ちます。デザインが最高。'}]},
  {id:38,cat:'bag',brand:'TaylorMade',name:'Blue Stripe Tour Staff Bag',img:'tmblue_1',gallery:['tmblue_1'],desc:'ブルーグラデーションのストライプ。オークリーフ刺繍入り。',descLong:'TaylorMade のツアースタッフバッグ限定モデル。ホワイトからディープブルーへのグラデーションストライプが爽やかな印象。オークリーフの刺繍とゴールドジッパーが上品なアクセントに。大型の TaylorMade ロゴが存在感を放ちます。',price:158000,badge:null,icon:null,specs:[['ブランド','TaylorMade'],['カラー','ホワイト × ブルーグラデーション'],['タイプ','ツアースタッフバッグ'],['素材','PUレザー'],['金具','ゴールドジッパー']],rating:4.9,reviews:[{user:'倉田 M.',date:'2026.07.15',text:'色合いが本当に綺麗。所有欲を満たしてくれます。'}]},
  {id:39,cat:'bag',brand:'Sun Day Red',name:'Vessel Stand Bag (White)',img:'sdr_1',gallery:['sdr_1','sdr_2','sdr_3','sdr_4'],desc:'タイガー・ウッズの新ブランド。ホワイトレザー×バーガンディ。',descLong:'タイガー・ウッズが立ち上げた Sun Day Red と VESSEL のコラボレーション・スタンドバッグ。上質なホワイトレザーにバーガンディのタイガーロゴ刺繍を配置。内部は起毛素材のフルレングス仕切りでクラブをしっかり保護。プレミアムな素材と機能性を両立した逸品です。',price:128000,badge:'NEW',icon:null,specs:[['ブランド','Sun Day Red × VESSEL'],['カラー','ホワイト × バーガンディ'],['タイプ','スタンドバッグ'],['素材','本革'],['仕切り','4分割フルレングス'],['機能','デュアルストラップ']],rating:5.0,reviews:[{user:'柴田 K.',date:'2026.07.17',text:'レザーの質感が素晴らしい。一生ものです。'},{user:'橋本 Y.',date:'2026.07.18',text:'タイガーファンとして即購入しました！'}]},
    {id:41,cat:'bag',brand:'Heritage Leather',name:'Vintage Leather Golf Case',img:'leather_case_1',gallery:['leather_case_1','leather_case_2','leather_case_5','leather_case_3','leather_case_4'],desc:'ハンドメイド本革のクラシックゴルフケース。真鍮金具＆タータンチェック裏地。',descLong:'職人が一点ずつ手縫いで仕上げた本革製ヴィンテージゴルフケース。上質なタンレザーに真鍮バックルとショルダーストラップを組み合わせた、往年のスコットランドスタイル。内部と蓋にはタータンチェックの裏地をあしらい、クラブを優しく保護します。専用のボール入れケース付き。使い込むほどに味わい深く育つ、生涯もののケースです。',price:88000,badge:'NEW',icon:null,specs:[['ブランド','Heritage Leather'],['素材','本革（タンニンなめし）'],['金具','真鍮'],['裏地','タータンチェック'],['付属品','ボールケース / ショルダーストラップ'],['製法','ハンドステッチ']],rating:5.0,reviews:[{user:'瀬川 K.',date:'2026.07.17',text:'革の質感が素晴らしい。使うほど風合いが増していきます。'},{user:'新井 T.',date:'2026.07.18',text:'クラシックゴルフにぴったり。所有する喜びがあります。'}]},
  {id:40,cat:'ball',brand:'TaylorMade',name:'TP5 Baseball Limited (12個入)',img:'tp5bb_1',gallery:['tp5bb_1','tp5bb_2','tp5bb_3'],desc:'2026限定。ベースボールデザインのTP5。5層構造。',descLong:'TaylorMade の2026年リミテッドエディション TP5。野球ボールの赤い縫い目を再現したユニークなデザインで、パッケージもレトロなベースボール仕様。5層構造による圧倒的な飛距離とグリーン周りのスピン性能はそのまま。コレクションにも実戦にも使える限定モデルです。',price:8470,badge:'NEW',icon:null,specs:[['ブランド','TaylorMade'],['モデル','TP5 2026 Limited Edition'],['デザイン','ベースボール'],['層構造','5ピース'],['入数','12個入り'],['備考','数量限定']],rating:4.9,reviews:[{user:'野口 H.',date:'2026.07.16',text:'デザインが可愛くて使うのがもったいない。'},{user:'三浦 T.',date:'2026.07.18',text:'性能は通常のTP5と同じ。プレゼントにも最適。'}]},

  {id:43,cat:'club',brand:'L.A.B GOLF',name:'VZN.1 Putter',img:'vzn_1',gallery:['vzn_1','vzn_2'],desc:'ゼロトルク設計で驚異の直進性。全10色のカラーモデル。',descLong:'L.A.B GOLF独自の「Lie Angle Balance」理論に基づき、ヘッドの重心をシャフト軸線上へ完全配置。ストローク中に生じる不要なフェース回転（トルク）を極限まで排除し、誰でも安定したストレートストロークを実現します。グリーン・ブルー・レッド・パープルなど全10色のアルマイトカラーからお選びいただけます。',price:68000,badge:'NEW',icon:null,specs:[['テクノロジー','Lie Angle Balance（ゼロトルク）'],['ヘッド素材','6061アルミニウム（アルマイト仕上げ）'],['シャフト長','33 / 34 / 35インチ'],['グリップ','L.A.B GOLFオリジナルグリップ'],['カラー','全10色展開']],rating:4.9,reviews:[{user:'岡田 R.',date:'2026.05.02',text:'パチンと入る感覚が別格。ラインに逆らわず素直に転がります。'},{user:'村上 A.',date:'2026.04.20',text:'カラーが豊富で自分だけの1本が選べるのが嬉しい。'}]},
  {id:44,cat:'club',brand:'L.A.B GOLF',name:'DF3i Putter',img:'df3i_1',gallery:['df3i_1','df3i_2'],desc:'デュアルフォース設計のマレット型。圧倒的な直進安定性。',descLong:'2つの慣性モーメント（MOI）源を組み合わせた「Dual Force」構造により、トウ・ヒール双方向のブレを抑制。ラウンド型マレットヘッドが視覚的なアライメントもサポートします。ホワイトシャフトと鮮やかなカラーリングの組み合わせが人気です。',price:68000,badge:'NEW',icon:null,specs:[['テクノロジー','Dual Force（デュアルフォースMOI）'],['ヘッド素材','6061アルミニウム（アルマイト仕上げ）'],['シャフト','ホワイトストレートシャフト'],['グリップ','L.A.B GOLFオリジナルグリップ'],['カラー','ピンク/パープル/グリーン/ブルー 他']],rating:4.7,reviews:[{user:'橋本 N.',date:'2026.04.28',text:'丸型ヘッドで構えやすく、パット数が確実に減りました。'}]},
];

// ── 商品画像（外部ファイル参照）──
// 画像は public/images/ に配置されています
const IMG_BASE = 'images/';
const PRODUCT_IMAGES = new Proxy({
  kitty_headcover: 'kitty_headcover.jpg',
  knit_headcover: 'knit_headcover.jpg',
  taotao_1: 'taotao_1.jpg',
  taotao_2: 'taotao_2.jpg',
  taotao_3: 'taotao_3.jpg',
  taotao_4: 'taotao_4.jpg',
  wiz_blk_1: 'wiz_blk_1.jpg',
  wiz_blk_2: 'wiz_blk_2.jpg',
  wiz_blk_3: 'wiz_blk_3.jpg',
  wiz_wht_1: 'wiz_wht_1.jpg',
  wiz_wht_2: 'wiz_wht_2.jpg',
  wiz_wht_3: 'wiz_wht_3.jpg',
  iron_navy_1: 'iron_navy_1.jpg',
  iron_navy_2: 'iron_navy_2.jpg',
  iron_navy_3: 'iron_navy_3.jpg',
  iron_navy_4: 'iron_navy_4.jpg',
  iron_navy_5: 'iron_navy_5.jpg',
  iron_navy_6: 'iron_navy_6.jpg',
  iron_blue_1: 'iron_blue_1.jpg',
  iron_blue_2: 'iron_blue_2.jpg',
  mc80_1: 'mc80_1.jpg',
  mc80_2: 'mc80_2.jpg',
  mc80_3: 'mc80_3.jpg',
  ignite_wb_1: 'ignite_wb_1.jpg',
  ignite_blk_1: 'ignite_blk_1.jpg',
  ignite_blk_2: 'ignite_blk_2.jpg',
  ignite_blk_3: 'ignite_blk_3.jpg',
  ignite_usa_1: 'ignite_usa_1.jpg',
  ignite_usa_2: 'ignite_usa_2.jpg',
  ignite_usa_3: 'ignite_usa_3.jpg',
  tm1909_1: 'tm1909_1.jpg',
  tm1909_2: 'tm1909_2.jpg',
  drac_1: 'drac_1.jpg',
  drac_2: 'drac_2.jpg',
  drac_3: 'drac_3.jpg',
  schwab_1: 'schwab_1.jpg',
  schwab_2: 'schwab_2.jpg',
  schwab_3: 'schwab_3.jpg',
  schwab_4: 'schwab_4.jpg',
  drag_1: 'drag_1.jpg',
  drag_2: 'drag_2.jpg',
  drag_3: 'drag_3.jpg',
  haw_dr_1: 'haw_dr_1.jpg',
  haw_dr_2: 'haw_dr_2.jpg',
  haw_dr_3: 'haw_dr_3.jpg',
  haw_pt_1: 'haw_pt_1.jpg',
  haw_pt_2: 'haw_pt_2.jpg',
  tit_align_1: 'tit_align_1.jpg',
  tit_align_2: 'tit_align_2.jpg',
  ogio_1: 'ogio_1.jpg',
  vader_1: 'vader_1.jpg',
  vader_2: 'vader_2.jpg',
  vader_3: 'vader_3.jpg',
  vader_4: 'vader_4.jpg',
  vader_5: 'vader_5.jpg',
  swag_1: 'swag_1.jpg',
  tmblue_1: 'tmblue_1.jpg',
  sdr_1: 'sdr_1.jpg',
  sdr_2: 'sdr_2.jpg',
  sdr_3: 'sdr_3.jpg',
  sdr_4: 'sdr_4.jpg',
  tp5bb_1: 'tp5bb_1.jpg',
  tp5bb_2: 'tp5bb_2.jpg',
  tp5bb_3: 'tp5bb_3.jpg',
  leather_case_1: 'leather_case_1.jpg',
  leather_case_2: 'leather_case_2.jpg',
  leather_case_3: 'leather_case_3.jpg',
  leather_case_4: 'leather_case_4.jpg',
  leather_case_5: 'leather_case_5.jpg',
  pickle_key_1: 'pickle_key_1.jpg',
  pg_kitty_set: 'pg_kitty_set.jpg',
  vzn_1: 'vzn-1.jpg',
  vzn_2: 'vzn-2.jpg',
  df3i_1: 'df3i-1.jpg',
  df3i_2: 'df3i-2.jpg',
}, {
  get(target, prop) {
    const file = target[prop];
    return file ? IMG_BASE + file : undefined;
  },
  has(target, prop) { return prop in target; }
});


// ── 状態 ──
let token = localStorage.getItem('fw_token') || null;
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('fw_cart') || '[]');

// ── API ──
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'APIエラー');
  return data;
}

// ── カート（localStorage同期）──
function saveCartLocal() {
  localStorage.setItem('fw_cart', JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function addToCart(productId, qty = 1) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const ex = cart.find(x => x.id === productId);
  if (ex) ex.qty += qty; else cart.push({ ...p, qty });
  saveCartLocal();
  syncCartServer();
  updateCartBadge();
  showToast(`${p.name} をカートに追加しました`);
}

let cartSyncTimer = null;
function syncCartServer() {
  if (!token) return;
  clearTimeout(cartSyncTimer);
  cartSyncTimer = setTimeout(() => {
    api('PUT', '/api/cart', { items: cart.map(i => ({ product_id: i.id, qty: i.qty })) }).catch(() => {});
  }, 800);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(b => b.textContent = count);
}

// ── セッション復元 ──
async function restoreSession() {
  if (!token) return;
  try {
    currentUser = await api('GET', '/api/profile');
    const serverCart = await api('GET', '/api/cart');
    if (serverCart.length) {
      serverCart.forEach(row => {
        const p = PRODUCTS.find(x => x.id === row.product_id);
        if (!p) return;
        const ex = cart.find(x => x.id === row.product_id);
        if (!ex) cart.push({ ...p, qty: row.qty });
      });
      saveCartLocal();
    }
  } catch {
    token = null;
    localStorage.removeItem('fw_token');
  }
  updateCartBadge();
  updateNavAuth();
}

function updateNavAuth() {
  const btn = document.getElementById('mypageNavBtn');
  const dot = document.getElementById('userDot');
  if (!btn) return;
  if (currentUser) {
    btn.classList.add('logged-in');
    if (dot) dot.style.background = 'var(--gold)';
  } else {
    btn.classList.remove('logged-in');
    if (dot) dot.style.background = 'var(--gray)';
  }
}

// ── トースト ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);background:var(--gold);color:var(--black);padding:.75rem 2rem;font-size:.82rem;font-weight:700;letter-spacing:.08em;z-index:9999;transition:transform .3s;pointer-events:none;white-space:nowrap;font-family:var(--font-ja)';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 2400);
}

// ── 商品画像ヘルパー ──
// アイコン or 実写画像を返す（img プロパティがあれば画像、なければ icon emoji）
function productThumb(p, size = 'icon') {
  if (p.img && PRODUCT_IMAGES[p.img]) {
    if (size === 'icon') {
      // カードのサムネ用
      return `<img src="${PRODUCT_IMAGES[p.img]}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${p.name}">`;
    } else {
      // モーダルのメイン画像用
      return `<img src="${PRODUCT_IMAGES[p.img]}" loading="lazy" style="max-width:280px;max-height:280px;object-fit:contain;border-radius:4px;" alt="${p.name}">`;
    }
  }
  return `<span style="font-size:${size==='icon'?'5.5rem':'8rem'}">${p.icon || '📦'}</span>`;
}

// ── 共通CSS変数 ──
const COMMON_CSS = `
  :root {
    --black:#383838;
    --dark:#444444;
    --forest:#1b5e20;
    --green:#2e7d32;
    --gold:#c9a84c;
    --gold-lt:#e2c97e;
    --cream:#f5f0e8;
    --gray:#9e9e9e;
    --red:#e53935;
    --font-en:'Cormorant Garamond',serif;
    --font-ja:'Zen Kaku Gothic New',sans-serif;
    --font-hd:'Bebas Neue',cursive;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#3c3c3c;color:var(--cream);font-family:var(--font-ja);font-weight:300;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#545454}::-webkit-scrollbar-thumb{background:var(--gold)}
  a{text-decoration:none;color:inherit}

  /* NAV */
  nav{position:fixed;top:0;left:0;right:0;z-index:90;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 3rem;background:rgba(52,52,52,0.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,168,76,0.15)}
  .nav-logo{font-family:var(--font-hd);font-size:1.8rem;letter-spacing:.18em;color:var(--cream)}
  .nav-logo span{color:var(--gold)}
  .nav-links{display:flex;gap:2rem;list-style:none}
  .nav-links a{font-size:.76rem;letter-spacing:.14em;color:rgba(245,240,232,.6);transition:color .2s}
  .nav-links a:hover,.nav-links a.active{color:var(--gold-lt)}
  .nav-right{display:flex;align-items:center;gap:1rem}
  .nav-btn{position:relative;background:none;border:1px solid rgba(201,168,76,.35);color:var(--cream);padding:.5rem 1.2rem;font-family:var(--font-ja);font-size:.78rem;letter-spacing:.1em;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem}
  .nav-btn:hover{background:var(--gold);color:var(--black);border-color:var(--gold)}
  .nav-btn.active{background:var(--gold);color:var(--black);border-color:var(--gold)}
  .nav-btn.logged-in .user-dot{background:var(--gold)}
  .cart-badge{background:var(--gold);color:var(--black);width:18px;height:18px;border-radius:50%;font-size:.6rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
  .user-dot{width:8px;height:8px;border-radius:50%;background:var(--gray);transition:background .2s}

  /* PAGE WRAPPER */
  .page-wrap{padding-top:70px;min-height:100vh}

  /* BTN */
  .btn-gold{padding:.8rem 2rem;background:var(--gold);color:var(--black);font-family:var(--font-ja);font-size:.82rem;font-weight:700;letter-spacing:.12em;border:none;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:.5rem}
  .btn-gold:hover{background:var(--gold-lt);transform:translateY(-2px)}
  .btn-ghost{padding:.8rem 2rem;background:transparent;color:var(--cream);font-family:var(--font-ja);font-size:.82rem;letter-spacing:.12em;border:1px solid rgba(245,240,232,.25);cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:.5rem}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
`;

// ── CSSを1回だけ注入 ──
(function(){ const s = document.createElement('style'); s.textContent = COMMON_CSS; document.head.appendChild(s); })();
