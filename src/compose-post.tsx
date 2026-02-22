import {
  Action,
  ActionPanel,
  Form,
  showToast,
  Toast,
  confirmAlert,
  Alert,
  popToRoot,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { getMastodonAccounts } from "./lib/accounts";
import { countGraphemes } from "./lib/graphemes";
import { postToAll } from "./lib/posting";

const GRAPHEME_LIMIT = 300;

export default function ComposePost() {
  const { data: mastoAccounts, isLoading } = usePromise(getMastodonAccounts);
  const [text, setText] = useState("");

  const graphemeCount = countGraphemes(text);
  const hasMastodon = (mastoAccounts?.length ?? 0) > 0;

  async function handleSubmit(values: {
    text: string;
    url: string;
    images: string[];
    [key: string]: string | string[] | boolean;
  }) {
    if (!values.text.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Post text is required",
      });
      return;
    }

    if (countGraphemes(values.text) > GRAPHEME_LIMIT) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Post exceeds 300 grapheme limit",
      });
      return;
    }

    const selectedMasto =
      mastoAccounts?.filter((a) => values[`masto_${a.id}`] !== false) ?? [];

    const targets =
      selectedMasto.length > 0
        ? `Bluesky and ${selectedMasto.length} Mastodon account(s)`
        : "Bluesky only";

    const confirmed = await confirmAlert({
      title: "Post to All Selected Accounts?",
      message: `This will post to ${targets}.`,
      primaryAction: { title: "Post", style: Alert.ActionStyle.Default },
    });

    if (!confirmed) return;

    await showToast({ style: Toast.Style.Animated, title: "Posting..." });

    await postToAll({
      text: values.text,
      url: values.url || undefined,
      images: values.images?.length > 0 ? values.images : undefined,
      mastodonAccounts: selectedMasto,
    });

    popToRoot();
  }

  return (
    <Form
      isLoading={isLoading}
      navigationTitle={`Post (${graphemeCount}/${GRAPHEME_LIMIT})`}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Post" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title={`Post (${graphemeCount}/${GRAPHEME_LIMIT})`}
        placeholder="What's on your mind?"
        onChange={setText}
        error={
          graphemeCount > GRAPHEME_LIMIT
            ? `${graphemeCount - GRAPHEME_LIMIT} graphemes over limit`
            : undefined
        }
      />
      <Form.TextField
        id="url"
        title="Link URL"
        placeholder="https://example.com (optional)"
      />
      <Form.FilePicker
        id="images"
        title="Images"
        allowMultipleSelection
        canChooseDirectories={false}
      />

      {hasMastodon && (
        <>
          <Form.Separator />
          {mastoAccounts?.map((account) => (
            <Form.Checkbox
              key={account.id}
              id={`masto_${account.id}`}
              label={`Mastodon: ${account.instance}`}
              defaultValue={true}
            />
          ))}
        </>
      )}
    </Form>
  );
}
