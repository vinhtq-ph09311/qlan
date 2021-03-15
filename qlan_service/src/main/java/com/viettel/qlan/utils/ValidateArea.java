package com.viettel.qlan.utils;

public class ValidateArea {
	
	
	private ValidateArea() {

	}

	// Kiểm tra null hoặc ký tự ""
	public static boolean isCheckNull(String str) {
		
		// trim() loại bỏ các khoảng trắng ở đầu và cuối chuỗi
		
		if (str == null || str.trim().equals("")) {
			return true;
		}
		return false;
	}

	// Kiểm tra ký tự đặc biệt
	public static boolean isCheckSpecialCharacter(String str) {
		String chuoi = "^.*[!@#$%^&*()+\\=\\[\\]{};':\"\\\\|,.<>\\/?].*$";
		if (str.matches(chuoi)) {
			return true;
		}
		return false;
	}

	// Kiểm tra trường code (mã) có chứa ký tự có dấu hay không ?
	public static boolean isCheckSpecialCode(String str) {
		String regex = "^.*[Ạ-ỹáàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ].*$";
		if (str.matches(regex)) {
			return true;
		}
		return false;
	}

	// Kiểm tra khoảng trắng
	public static boolean hasWhiteSpace(String str) {
		String regex = "^.*[ ].*$";
		if (str.matches(regex)) {
			return true;
		}
		return false;
	}
	
	// Kiểm tra định dạng html
	public static boolean htmlCheck(String str) {
		String regex = "^.*[<>].*$";
		if (str.matches(regex)) {
			return true;
		}
		return false;
	}

}
