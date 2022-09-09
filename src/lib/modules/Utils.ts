export class Utils {
	public static round(num: number, digits: number): number {
		const pow = Math.pow(10, digits);
		return Math.round(num * pow) / pow;
	}
}
