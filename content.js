// ページ（DOM）の変更を監視するオブザーバーを作成
const observer = new MutationObserver(debounce(sortSubtitleMenu, 100));

// 監視を開始 (body要素全体の子要素の追加・削除を監視)
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/**
 * 関数が連続で呼び出されるのを防ぎ、最後の呼び出しから指定時間後に実行する（デバウンス）
 * @param {function} func 実行する関数
 * @param {number} wait 待機時間 (ミリ秒)
 * @returns {function} デバウンス化された関数
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}


// 字幕メニューをソートする関数
function sortSubtitleMenu() {
    // 1. 字幕メニューのパネルを探す (セレクタはYouTubeのアップデートで変わる可能性があります)
    const menuItems = document.querySelectorAll('.ytp-menuitem');
    
    if (menuItems.length === 0) {
        return; // メニューが開かれていなければ何もしない
    }

    // NodeListを配列に変換して扱いやすくする
    const menuItemsArray = Array.from(menuItems);

    // 2. 「日本語」の項目を探す
    const japaneseItem = menuItemsArray.find(item => 
        item.textContent.trim() === '日本語' || item.getAttribute('data-value') === 'ja'
    );

    // 3. 「日本語」が見つかった場合
    if (japaneseItem) {
        const subtitleList = japaneseItem.parentElement;
        // それが先頭でない場合にのみ、先頭に移動する
        if (subtitleList && subtitleList.firstChild !== japaneseItem) {
            subtitleList.insertBefore(japaneseItem, subtitleList.firstChild);
        }
    }
}
