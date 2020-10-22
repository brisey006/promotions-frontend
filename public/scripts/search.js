const shorten = (data, l) => {
    let limit = l;
    limit = limit == undefined ? 200 : limit;
    let des = data.length > limit ? `${data.substring(0, limit - 3)}...` : data;
    return des;
}

async function searchFromApi(value) {
    const resultsContainer = document.querySelector('#resultsContainer');
    const searchResult = await axios.get(`/search-promotions?query=${value}`);
    const results = searchResult.data;
    
    let resultElements = "";
    for (promotion of results.docs) {
        const promotionElement = `
        <a href="/view/${promotion.slug}">
            <img src="${promotion.displayImage.thumbnail}" alt="img" class="img-fluid rounded-sm shadow-xl">
            <span>${promotion.title}</span>
            <strong>${shorten(promotion.description, 40)}</strong>
            <i class="fa fa-angle-right"></i>
        </a>`;
        resultElements += promotionElement;
    }
    resultsContainer.innerHTML = resultElements;
}

const searchPromotion = async (e) => {
    const value = e.value;
    localStorage.searchValue = value;
    await searchFromApi(value);
};