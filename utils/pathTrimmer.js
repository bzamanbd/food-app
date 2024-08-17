const pathTrimmer = (oldItems,newItems)=>{ 
    if (oldItems.length>0) {
        oldItems.forEach(item => {
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
export default pathTrimmer;
