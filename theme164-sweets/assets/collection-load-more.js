
  let isLoading = false;
  const currentUrl = window.location.href; 

  const zmzLoadMore = async (button) => {
    if (isLoading) return; 
    isLoading = true;
    const loadMoreWrapper = document.querySelector('#zmz-load-more');
    if(!loadMoreWrapper) return; 
    button = loadMoreWrapper.querySelector('#zmz-load-button') || button;
    const dataInfinite = loadMoreWrapper.getAttribute('data-infinite'); 
    const loadMoreSpinner = loadMoreWrapper.querySelector('.load-more__spinner'); 
    const paginationList = document.querySelector('.pagination');
    const gridContainer = document.querySelector('.product-grid');

    if(!button) return;

    try {
      if(dataInfinite == 'false') {
        button.classList.add('hidden');  
      }
      const nextDataUrl = button.getAttribute('data-next-url');
      const nextUrl = new URL(nextDataUrl, currentUrl).href; 

      gridContainer.classList.add('loading'); 
      loadMoreSpinner.classList.remove('hidden'); 

      const response = await fetch(nextUrl); 
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.text();
      const parser = new DOMParser();
      const parseFromString = parser.parseFromString.bind(parser); // Bind the context to the parseFromString method
      const newPage = parseFromString(data, 'text/html');  

      if(newPage) {

        if(dataInfinite == 'false') {
          button.classList.remove('hidden');
        }

        const grid = document.querySelector('[data-grid-js]'); 
        grid.innerHTML += newPage.querySelector('[data-grid-js]').innerHTML;

        activeCompare();
        activeWishlist();

        const loadMore = document.querySelector('#zmz-load-more');
        loadMore.replaceWith(newPage.querySelector('#zmz-load-more'));   
        
        if (paginationList) {
          paginationList.replaceWith(newPage.querySelector('.pagination'));   
        }
      }

      if(dataInfinite === 'false') {
      const event = new CustomEvent('zmz.paginate.next');
      document.querySelector('#zmz-load-more').dispatchEvent(event);
      if (paginationList) {
        document.querySelector('.pagination').dispatchEvent(event);
      }
    }
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      isLoading = false;
      gridContainer.classList.remove('loading'); 
      loadMoreSpinner.classList.add('hidden');
      if(dataInfinite == 'false') {
        button.classList.remove('hidden');  
      }
    }
  }; 

  const handleInfiniteScroll = () => {
    const loadTarget = document.querySelector('#zmz-load-more');
    if(!loadTarget) return;
    const dataInf = loadTarget.getAttribute('data-infinite');  
    if(dataInf != 'true') return; 
    const buttonTarget = loadTarget.querySelector('#zmz-load-button');
    if(!loadTarget || !buttonTarget) return; 
    const scrollOffset = 100; 
    const targetScroll = loadTarget.offsetTop;
    const scrollPosition = window.innerHeight + window.pageYOffset;  

    if (scrollPosition >= targetScroll - scrollOffset) {
      zmzLoadMore();  
    }
  };

window.addEventListener('scroll', handleInfiniteScroll); 

