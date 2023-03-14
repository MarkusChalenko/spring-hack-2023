export class RegexpMatchForAuthorization {
  public static readonly ONLY_LETTERS_DASHES_SPACES =
    /^(?=.{1,50}$)[a-z]+(?:['-\s][a-z]+)*$/i;
  public static readonly PASSWORD_PATTERN =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
}
