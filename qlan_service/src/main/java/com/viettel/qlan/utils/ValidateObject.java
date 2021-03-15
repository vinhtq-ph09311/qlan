package com.viettel.qlan.utils;

public class ValidateObject {

	private ValidateObject() {

	}

	public static boolean Ischecknull(String str) {
		if (str == null || str.trim().equals("")) {
			return true;
		}
		return false;
	}

	public static boolean IscheckspecialCharacter(String str) {
		String ch = "^.*[!@#$%^&*()+\\=\\[\\]{};':\"\\\\|,.<>\\/?].*$";

		if (str.matches(ch)) {
			return true;
		}
		return false;
	}

	public static boolean IsCheckspecialCharacterCode(String str) {
		String regex = "^.*[Ạ-ỹáàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ].*$";
		if (str.matches(regex)) {
			return true;
		}

		return false;
	}
	
	public static boolean hasWhiteSpace(String str) {
	      String regex = "^.*[ ].*$";
	      if (str.matches(regex)) {
			return true;
		}
		return false;
	}
	
	public static boolean htmlCheck(String str) {
	      String regex = "^.*[<>].*$";
	      if (str.matches(regex)) {
			return true;
		}
	      return false;
	}
}
