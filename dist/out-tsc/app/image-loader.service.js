import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ImageLoaderService = class ImageLoaderService {
    constructor(http) {
        this.http = http;
    }
    loadImage(url) {
        return this.http.get(url, { responseType: 'blob' });
    }
};
ImageLoaderService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ImageLoaderService);
export { ImageLoaderService };
//# sourceMappingURL=image-loader.service.js.map