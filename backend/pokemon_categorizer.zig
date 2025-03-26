const std = @import("std");

const PokemonStat = struct {
    base_stat: i32,
    effort: i32,
    stat: struct {
        name: []const u8,
        url: []const u8,
    },
};

const InputStats = struct {
    stats: []PokemonStat,
};

const Stats = struct {
    hp: f32 = 0,
    attack: f32 = 0,
    defense: f32 = 0,
    special_attack: f32 = 0,
    special_defense: f32 = 0,
    speed: f32 = 0,
};

const RoleScores = struct {
    Tank: f32,
    Attacker: f32,
    Speedster: f32,
    Support: f32,
};

fn processStats(input_stats: []PokemonStat) Stats {
    var stats = Stats{};

    for (input_stats) |stat| {
        const stat_name = stat.stat.name;
        const base_stat: f32 = @floatFromInt(stat.base_stat);

        if (std.mem.eql(u8, stat_name, "hp")) {
            stats.hp = base_stat;
        } else if (std.mem.eql(u8, stat_name, "attack")) {
            stats.attack = base_stat;
        } else if (std.mem.eql(u8, stat_name, "defense")) {
            stats.defense = base_stat;
        } else if (std.mem.eql(u8, stat_name, "special-attack")) {
            stats.special_attack = base_stat;
        } else if (std.mem.eql(u8, stat_name, "special-defense")) {
            stats.special_defense = base_stat;
        } else if (std.mem.eql(u8, stat_name, "speed")) {
            stats.speed = base_stat;
        }
    }

    return stats;
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const stdin = std.io.getStdIn();
    const stdout = std.io.getStdOut();

    // Read JSON input
    var buffer: [4096]u8 = undefined;
    const len = try stdin.read(&buffer);
    const input = buffer[0..len];

    // Parse JSON
    var parsed = try std.json.parseFromSlice(InputStats, allocator, input, .{});
    defer parsed.deinit();

    // Process the raw stats into our normalized format
    const stats = processStats(parsed.value.stats);

    // Calculate role scores
    const scores = RoleScores{
        .Tank = stats.hp * 0.4 + stats.defense * 0.35 + stats.special_defense * 0.25,
        .Attacker = stats.attack * 0.6 + stats.special_attack * 0.4,
        .Speedster = stats.speed * 0.8 + (stats.attack + stats.special_attack) * 0.1,
        .Support = stats.special_defense * 0.4 + stats.hp * 0.3 + stats.defense * 0.3,
    };

    // Find highest score
    var max_role: []const u8 = "Tank";
    var max_score: f32 = scores.Tank;

    const fields = std.meta.fields(RoleScores);
    inline for (fields) |field| {
        const score = @field(scores, field.name);
        if (score > max_score) {
            max_score = score;
            max_role = field.name;
        }
    }

    try stdout.writer().print("{s}", .{max_role});
}
