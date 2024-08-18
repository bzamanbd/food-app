

export const pathTrimmer = ({items,newItems}) =>{ 
    if (items.length>0) {
        items.forEach(item => {
            const fullPath = item; 
            // Find the index where "public" starts in the full path
            const publicIndex = fullPath.indexOf('public');
            // Extract the path starting from "public"
            const relativePath = fullPath.substring(publicIndex);
            newItems.push(relativePath);
        });
    }
    return newItems
}

