export default function capchaGenerator() {
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}
