function api(route) {
    return `/v1/api/${route}?token=${localStorage.getItem(
        "token"
    )}`;
}
function tokenAdd(route) {
    return `${route}?token=${localStorage.getItem("token")}`;
}