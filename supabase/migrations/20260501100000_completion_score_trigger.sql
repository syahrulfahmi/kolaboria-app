-- Create a function to calculate and update completion score
CREATE OR REPLACE FUNCTION public.calculate_completion_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  score integer := 0;
  p public.profiles%ROWTYPE;
  skill_count integer;
  tool_count integer;
  target_profile_id uuid;
BEGIN
  -- Determine the target profile ID based on the triggering table and operation
  IF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'user_skills' OR TG_TABLE_NAME = 'user_tools' THEN
      target_profile_id := OLD.user_id;
    END IF;
  ELSE
    IF TG_TABLE_NAME = 'profiles' THEN
      target_profile_id := NEW.id;
    ELSIF TG_TABLE_NAME = 'user_skills' OR TG_TABLE_NAME = 'user_tools' THEN
      target_profile_id := NEW.user_id;
    END IF;
  END IF;

  -- Fetch the profile, skill count, and tool count
  SELECT * INTO p FROM public.profiles WHERE id = target_profile_id;
  SELECT COUNT(*) INTO skill_count FROM public.user_skills WHERE user_id = target_profile_id;
  SELECT COUNT(*) INTO tool_count FROM public.user_tools WHERE user_id = target_profile_id;

  -- Calculate the score
  IF skill_count > 0 THEN score := score + 30; END IF;
  IF p.bio IS NOT NULL AND trim(p.bio) != '' THEN score := score + 20; END IF;
  IF tool_count > 0 THEN score := score + 20; END IF;
  IF p.headline IS NOT NULL AND trim(p.headline) != '' THEN score := score + 15; END IF;
  IF p.location IS NOT NULL AND trim(p.location) != '' THEN score := score + 15; END IF;

  -- Update the completion_score in the profiles table only if it changed
  IF p.completion_score IS DISTINCT FROM score THEN
    UPDATE public.profiles
    SET completion_score = score
    WHERE id = target_profile_id;
  END IF;

  RETURN NULL; -- For AFTER triggers, returning NULL is fine
END;
$$;

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS update_completion_score_profiles ON public.profiles;
DROP TRIGGER IF EXISTS update_completion_score_user_skills ON public.user_skills;
DROP TRIGGER IF EXISTS update_completion_score_user_tools ON public.user_tools;

-- Trigger on profiles (bio, headline, location)
CREATE TRIGGER update_completion_score_profiles
AFTER INSERT OR UPDATE OF bio, headline, location ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.calculate_completion_score();

-- Trigger on user_skills
CREATE TRIGGER update_completion_score_user_skills
AFTER INSERT OR DELETE ON public.user_skills
FOR EACH ROW
EXECUTE FUNCTION public.calculate_completion_score();

-- Trigger on user_tools
CREATE TRIGGER update_completion_score_user_tools
AFTER INSERT OR DELETE ON public.user_tools
FOR EACH ROW
EXECUTE FUNCTION public.calculate_completion_score();
