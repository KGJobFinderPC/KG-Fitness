import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl =
    "https://avvphydpscxesbjoibjt.supabase.co";

const supabaseKey =
    "sb_publishable_h-exdUJpg7ytOL3RQc74ew_2P_2taIx";

export const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );

console.log("KG Fitness - Supabase connected");