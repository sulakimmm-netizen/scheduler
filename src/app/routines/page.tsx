import { createClient } from "@/lib/supabase/server";
import { getAllRoutines } from "@/lib/queries";
import { RoutineList } from "@/components/routines/routine-list";

export default async function RoutinesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const routines = await getAllRoutines(user.id);

  return <RoutineList routines={routines} />;
}
