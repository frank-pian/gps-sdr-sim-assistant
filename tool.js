class GpsTool{
    pi = 3.14159265358979324
    a = 6378245.0//克拉索夫斯基椭球参数长半轴a
    ee = 0.00669342162296594323//克拉索夫斯基椭球参数第一偏心率平方

    WGSLat(lat, lng) {
        let dLat = this._transformLat(lng - 105.0, lat - 35.0);
        let radLat = lat / 180.0 * this.pi;
        let magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        let sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
        return (lat - dLat);
    }

    WGSLng(lat, lng) {
        let dLng = this._transformLng(lng - 105.0, lat - 35.0);
        let radLat = lat / 180.0 * this.pi
        let magic = Math.sin(radLat)
        magic = 1 - this.ee * magic * magic
        let sqrtMagic = Math.sqrt(magic)
        dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
        return (lng - dLng);
    }

    _transformLng(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0
        return ret
    }

    _transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;
        return ret;
    }
}